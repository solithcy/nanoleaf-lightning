require('dotenv').config();
const Lightning = require('./classes/Lightning');
const Nanoleaf = require('./classes/Nanoleaf');
const fetch = require('node-fetch');
const debug = require('debug')('lightning:app');

(async () => {
  debug(`Getting location..`);
  let ipdata = await fetch('http://ip-api.com/json').then(res => res.json());
  const config = {
    max_distance: process.env.MAX_DISTANCE || Infinity,
    lat: ipdata.lat || 0,
    lon: ipdata.lon || 0,
    brightness: parseInt(process.env.NANOLEAF_BRIGHTNESS || "100")
  }

  debug(`Using config: ${JSON.stringify({
    ...config,
    lat: "~"+Math.round(config.lat),
    lon: "~"+Math.round(config.lon),
  })}`);
  await new Promise(r => setTimeout(r, 1000));
  const nanoleaf = new Nanoleaf({
    ip: process.env.NANOLEAF_IP,
    token: process.env.NANOLEAF_ACCESS_TOKEN
  }, {
    brightness: config.brightness
  });
  debug("Test flash..")
  nanoleaf.flashLightning().then(()=>{
    debug("Test flash complete");
  });
  const lightning = new Lightning(config.lat, config.lon);
  lightning.on('data', (data) => {
    if(data.distance > config.max_distance) return;
    debug(`${(data.distance / 1000).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}km away`);
    nanoleaf.flashLightning();
  });
})();
