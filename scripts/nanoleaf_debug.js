// -------------------------------------------------------------------------------------------------------------------
// Hold down the power button on your Nanoleaf device for 5 seconds until the LED starts flashing. Then you'll have 30
// seconds to run the following script to get your access token.
// -------------------------------------------------------------------------------------------------------------------

require('dotenv').config();
(async() => {
  const nanoleaf = await import('nanoleaf-client');
  const client = new nanoleaf.NanoleafClient(process.env.NANOLEAF_IP);
  client.authorize().then(token => {
    console.log(token);
  }).catch(err => {
    console.log(err);
  });
})();
