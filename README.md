# Prerequisites
- Install Node.js https://nodejs.org
- Clone project
- Run, `npm install` in project folder

# Usage

## Base command
```
npm run cli -- [options]
```

## Options
```
-t <value>, --targetIp <value>      [Required] IP address of the Neewer GL1 Pro light to control.
--on                                Turn the light on.
--off                               Turn the light off.
-b <value>, --brightness <value>    Set the brightness level (1-100).
-k <value>, --kelvin <value>        Set the color temperature in Kelvin (29-70).
-y <value>, --yourIp <value>        Specify your IP address. If not set, the system will attempt to auto-detect it.
-q, --quiet                         Suppress all console.log outputs.
```

# Examples

## Turn on the light
```
npm run cli -- --targetIp 192.168.1.123 --on
```

## Turn on the light and set brightness and color temperature.
```
npm run cli -- --targetIp 192.168.1.123 --on --brightness 50 --kelvin 35
```

## Turn off the light
```
npm run cli -- --targetIp 192.168.1.123 --off
```


# Credits

Thanks to [braintapper](https://github.com/braintapper), for the reverse engineering work done for Neewer GL1.
https://github.com/braintapper/neewer-gl1
