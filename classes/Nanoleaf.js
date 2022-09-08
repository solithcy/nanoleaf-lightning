const debug = require('debug')('nanoleaf:controller');

class Nanoleaf{
  constructor(auth = {}, opts = {}){
    debug(`Device: ${auth.ip}`);
    debug(`Token: ${auth.token.slice(0, 4)}..${auth.token.slice(-4)}`);
    this.auth = auth;
    this.ready = false;
    this.queue = [];
    this.dummyamt = 0;
    this.brightness = opts.brightness || 100;
    this.handleNanoLeaf();
  }

  async handleNanoLeaf(){
    const nanoleaf = await import('nanoleaf-client');
    this.nanoleaf = new nanoleaf.NanoleafClient(this.auth.ip, this.auth.token);
    this.ready = true;
  }

  waitForReady = async() => {
    while(!this.ready){
      await new Promise(r => setTimeout(r, 100));
    }
  }

  updateBrightness = async(brightness) => {
    this.brightness = brightness;
  }

  flashLightning = async() => {
    await this.waitForReady();
    const id = Math.random().toString(36).substring(2, 15);
    if(this.queue.length >= 2) return this.dummyamt++;
    this.queue.push(id);
    while(this.queue[0] !== id){
      await new Promise(r => setTimeout(r, 5));
    }
    const amt = this.dummyamt + 1;
    let delay = 500 + (200 * amt);
    debug(`Flashing ${amt} time${amt === 1 ? '' : 's'}`);
    try{
      let state = await this.nanoleaf.getInfo().then(info => info.state);
      let effect = await this.nanoleaf.getSelectedEffect();
      await this.nanoleaf.setBrightness(this.brightness || 100);
      await this.nanoleaf.setEffect("strobe");
      await new Promise(r => setTimeout(r, delay));
      await this.nanoleaf.setBrightness(state.brightness?.value);
      switch(state.colorMode){
        case "effect":
          await this.nanoleaf.setEffect(effect);
          break;
        case "hue":
          await this.nanoleaf.setHue(state.hue?.value);
          break;
        case "sat":
          await this.nanoleaf.setSaturation(state.sat?.value);
          break;
        case "ct":
          await this.nanoleaf.setColorTemperature(state.ct?.value);
          break;
      }
      if(!state.on?.value){
        await this.nanoleaf.turnOff();
      }
      await new Promise(r => setTimeout(r, 1000));
    }finally{
      this.dummyamt -= (amt-1);
      this.queue.shift();
    }
  }
}

module.exports = Nanoleaf;
