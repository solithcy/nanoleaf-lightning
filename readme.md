
# Nanoleaf Lightning

Uses the [blitzortung.org](https://blitzortung.org) API to display nearby lightning strikes as flashes on Nanoleaf devices. After flashing, the lights reset to their previous state, meaning you can still use the lights as normal while the script is running.

## Prerequisites

- NodeJS >=v14.19.1
- A Nanoleaf light installation (I'm using [shapes](https://nanoleaf.me/en-GB/products/nanoleaf-shapes/))

## Installation
```
git clone https://github.com/solithcy/nanoleaf-lightning
cd nanoleaf-lightning
npm i
```

## Setup
Firstly, either download the "strobe" effect by "wispy__band__670" (me), or make a new effect on your Nanoleaf device. It must have the following configuration:
```
Name: strobe
Pallette: Black and (White or other)
Motion: Flow
- Delay: 0
- Loop: yes
- Speed: max (0.1s between each colour)
```
The script [uses this effect](https://github.com/RoseChilds/nanoleaf-lightning/blob/master/classes/Nanoleaf.js#L43-L65) to "flash" the lights, as simply turning them on and off doesn't create the same effect. As the name suggests, don't use this if you have epilepsy.

Get the IP address of your Nanoleaf device (this can be found on your router dashboard).

Then set the following environment variables in a `.env` file:

|Var|Desc|Recommended|
|--|--|--|
|`MAX_DISTANCE`|The farthest away a lightning strike can flash your lights (in m).|`100000`|
|`DEBUG`|Debugging|`lightning:*,nanoleaf:*`
|`NANOLEAF_IP`|The IP of your Nanoleaf device.|
|`NANOLEAF_BRIGHTNESS`|The brightness your lights will flash at.|More than 50
|`NANOLEAF_ACCESS_TOKEN`|See below how to obtain an access token. Make sure `NANOLEAF_IP` is set before running the script.

To obtain an access token, follow the instructions in `scripts/nanoleaf_debug.js`. Make sure `NANOLEAF_IP` is set before running.

## Running
I use [pm2](https://pm2.keymetrics.io/) to run this script in the background whenever my PC is on (`pm2 start . --name lightning && pm2 save`), however you can also just use `npm start`.

## Credits
|Author||
|--|--|
|me|Main project|
|[blitzortung.org](https://blitzortung.org)|Awesome lightning API|
|[VadimGarkusha](https://github.com/VadimGarkusha)|[nanoleaf-client](https://github.com/VadimGarkusha/nanoleaf-client)|
|[mrk-its](https://github.com/mrk-its)|[Blitzortung decoding](https://github.com/mrk-its/homeassistant-blitzortung/blob/master/ws_client/ws_client/client.py#L20-L34)

## License
GNU General Public License v3.0
