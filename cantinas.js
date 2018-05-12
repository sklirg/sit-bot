// Uses notiwire to fetch food info. See
// https://github.com/dotkom/notiwire/blob/8b25461d39563f64b9109d8ce2f131778427c209/libs/cantina.js
// and 
// https://github.com/dotkom/notiwire/blob/master/routes/api.js

const fetch = require('node-fetch');


const NOTIWIRE_API = 'https://passoa.online.ntnu.no/api/'
const NOTIWIRE_CANTINAS = 'cantina/'

const defaultCantinas = ['hangaren', 'realfag', 'storkiosk%20gloshaugen']

async function getCantina(cantina) {
  const url = `${NOTIWIRE_API}${NOTIWIRE_CANTINAS}${cantina}`;
  console.log('Requesting cantina info at', url)
  const response = await fetch(url);
  const json = await response.json();
  console.log('response', json)
  return json;
}

function getDefaultCantinas() {
  return defaultCantinas;
}

module.exports = {
  getCantina,
  getDefaultCantinas,
}
