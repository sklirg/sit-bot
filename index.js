const restify = require('restify');

const { getCantina, getCantinas, getDefaultCantinas } = require('./cantinas');
const { generateSlackMessage, postDelayedSlackMessage, slackInstall, userSelectCantinaMessage } = require('./slack');

const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SB_SENTRY_DSN || '' });

async function cantinas(req, res, next) {
  const response_url = req.body.response_url;

  const requestedCantina = ((req.body) && req.body.text.trim()) || '';

  if (requestedCantina === 'help') {
    res.send({
      text: 'Oppgi en kantine, eller spør om noen standardkantiner. Du vil få informasjon om åpningstid og meny ved disse. For informasjon om hvilke kantiner som støttes, besøk: https://github.com/dotkom/notiwire/blob/8b25461d39563f64b9109d8ce2f131778427c209/libs/cantina.js#L122 – Rapporter feil og problemer på GitHub, prosjektet er åpent og finnes her: https://github.com/sklirg/sit-bot'
    })
    return next();
  } else if (requestedCantina === 'select') {
    res.send(userSelectCantinaMessage(await getCantinas()));
    return next();
  }

  const cantinaToFetch = (requestedCantina === '' ? getDefaultCantinas() : requestedCantina.split(','));

  if (cantinaToFetch.length === 1) {
    // Asks for one cantina
    res.send(generateSlackMessage(await getCantina(cantinaToFetch[0])));
  } else {
    // Asks for multiple cantinas.
    res.send();
    cantinaToFetch.forEach(async cantina => {
      const cantinaInfo = await getCantina(cantina.trim());
      await postDelayedSlackMessage(response_url, generateSlackMessage(cantinaInfo));
    });
  }
  return next();
}

async function cantina(req, res, next) {
  res.send(generateSlackMessage(await getCantina(req.params.name)));
  next();
}

var server = restify.createServer();

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/api/cantina', cantinas);
server.post('/api/cantina/', cantinas);
server.post('/api/cantina/:name', cantina);
server.get('/api/oauth/slack-install', slackInstall)

server.listen(8085, function() {
  console.log('%s listening at %s', server.name, server.url);
});