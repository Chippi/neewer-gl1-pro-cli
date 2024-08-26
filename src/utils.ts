import { networkInterfaces } from 'os';

export const textToHex = (value: string) => Buffer.from(value, 'utf8').toString('hex');

export const numberToHex = (value: number) => value.toString(16).padStart(2, '0');

export const appendHexWithChecksum = (hex: string) => {
  const buffer = Buffer.from(hex, 'hex');
  let checksum = buffer.reduce((p, c) => p + c, 0);
  checksum %= 256;

  return `${hex}${numberToHex(checksum)}`;
};

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export const guessYourIp = () => {
  const interfaces = networkInterfaces();
  const potentialInterfaces = Object.values(interfaces)
    .flat()
    .filter((x) => x?.family === 'IPv4' && x.internal === false);

  const yourIp = potentialInterfaces[0]?.address;

  if (!yourIp) {
    console.error(
      'Failed to auto-detect your IP address. Try to specify your IP manually using the --yourIp option.'
    );
    process.exit(1);
  }

  return yourIp;
};
