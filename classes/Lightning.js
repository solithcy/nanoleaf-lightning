const {WebSocket} = require('ws');
const EventEmitter = require('events');
const debug = require('debug')('lightning:ws');

class Lightning extends EventEmitter{
  constructor(lat=0, lon=0){
    super();
    this.lat = lat;
    this.lon = lon;
    this.hosts = ["ws1", "ws5", "ws6", "ws7", "ws8"];
    debug(`Initializing..`);
    this.handleWs();
  }

  handleWs(){
    this.ws = new WebSocket(`wss://${this.hosts[Math.floor(Math.random() * this.hosts.length)]}.blitzortung.org/`);
    this.ws.addEventListener('open', () => {
      debug(`Connected`);
      this.ws.send(JSON.stringify({
        a: 767
      }));
    });
    this.ws.addEventListener('close', () => {
      debug(`Disconnected, attempting to reconnect..`);
      this.connected = false;
      this.handleWs();
    });
    this.connected = false;
    this.ws.addEventListener('message', this.handleEvent);
  }

  decode(data){
    const e = {};
    const d = data.split('');
    let c = d[0];
    let f = c;
    const g = [c];
    const h = 256;
    let o = h;
    for(let b = 1; b < d.length; b++){
      let a = d[b].charCodeAt(0);
      if(h > a){
        a = d[b];
      }else{
        a = e[a] || f + c;
      }
      g.push(a);
      c = a.charAt(0);
      e[o] = f + c;
      o++;
      f = a;
    }
    return g.join("");
  }

  getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  degreesToMeters = (distance) => {
    return distance * 111139;
  }

  handleEvent = (event) => {
    if(!this.connected){
      this.connected = true;
      debug(`Received first event`);
    }
    let encoded = event.data;
    let decoded = this.decode(encoded);
    let data = JSON.parse(decoded);
    data.distance = this.degreesToMeters(this.getDistance(this.lat, this.lon, data.lat, data.lon));
    this.emit('data', data);
  }
}

module.exports = Lightning;
