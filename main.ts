import { Command } from '@commander-js/extra-typings';
import { createSocket } from 'node:dgram';
import { appendHexWithChecksum, guessYourIp, numberToHex, sleep, textToHex } from './src/utils';

const PORT = 5052;
const COMMAND_DELAY = 500;
const ON_COMMAND = '800502010189';
const OFF_COMMAND = '800502010088';

const getHandshakeCommands = (yourIp: string) => {
  const firstCommand = `80020f00000c${textToHex(yourIp)}f9`;
  return [firstCommand, '8006010188'];
};

const getBrightnessAndKelvinCommand = ({
  brightness,
  kelvin,
}: {
  brightness: number;
  kelvin: number;
}) => {
  const brightnessAsHex = numberToHex(brightness);
  const kelvinAsHex = numberToHex(kelvin);
  const hexCommand = `80050402${brightnessAsHex}${kelvinAsHex}32`;

  return appendHexWithChecksum(hexCommand);
};

const getOptions = () => {
  const program = new Command()
    .requiredOption('-t, --targetIp <value>', 'IP address of the Neewer GL1 Pro light to control.')
    .option('--on', 'Turn the light on.')
    .option('--off', 'Turn the light off.')
    .option('-b, --brightness <number>', 'Set the brightness level (1-100).', Number)
    .option('-k, --kelvin <number>', 'Set the color temperature in Kelvin (29-70).', Number)
    .option(
      '-y, --yourIp <value>',
      'Specify your IP address. If not set, the system will attempt to auto-detect it.'
    )
    .option('-q, --quiet', 'Suppress all console.log outputs.')
    .parse();

  const options = program.opts();

  if ((options.brightness && !options.kelvin) || (!options.brightness && options.kelvin)) {
    console.error(
      'Both brightness (--b) and kelvin (--k) values are required. Please provide both options.'
    );
    process.exit(1);
  }

  return options;
};

const createCommandsFromOptions = (options: ReturnType<typeof getOptions>) => {
  let commands: string[] = [];

  if (options.on) {
    commands = [...commands, ON_COMMAND];
  }

  if (options.brightness && options.kelvin) {
    const bkCommand = getBrightnessAndKelvinCommand({
      brightness: options.brightness,
      kelvin: options.kelvin,
    });

    commands = [...commands, bkCommand];
  }

  if (options.off) {
    commands = [...commands, OFF_COMMAND];
  }

  return commands;
};

const sendCommands = async ({
  targetIp,
  commands,
  quiet,
}: {
  targetIp: string;
  commands: string[];
  quiet?: boolean;
}) => {
  const client = createSocket('udp4');

  for (const command of commands) {
    const buffer = Buffer.from(command, 'hex');
    const bytes = buffer.byteLength;

    if (!quiet) {
      console.log(`Sending ${command} (${bytes} bytes) to ${targetIp}`);
    }

    client.send(buffer, PORT, targetIp, (err) => {
      if (err) {
        console.error(err);
        client.close();
        process.exit(1);
      }
    });

    await sleep(COMMAND_DELAY);
  }

  client.close();
};

(async () => {
  const options = getOptions();
  const commands = createCommandsFromOptions(options);
  const yourIp = options.yourIp || guessYourIp();

  sendCommands({
    targetIp: options.targetIp,
    commands: [...getHandshakeCommands(yourIp), ...commands],
    quiet: options.quiet,
  });
})();
