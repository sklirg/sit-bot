const restify = require('restify');

const { getCantina, getDefaultCantinas } = require('./cantinas');
const { generateSlackMessage, postDelayedSlackMessage } = require('./slack');

async function cantinas(req, res, next) {
  const response_url = req.body.response_url;

  const requestedCantina = ((req.body) && req.body.text.trim()) || '';
  // !req.body.text || req.body.text !== '' || req.body.text.split(' ').length === 1

  const cantinaToFetch = (requestedCantina === '' ? getDefaultCantinas() : requestedCantina.split(','));

  if (cantinaToFetch.length === 1) {
    // Asks for one cantina
    res.send(generateSlackMessage(await getCantina(cantinaToFetch[0])));
  } else {
    // Asks for no specific; defaults to all.
    res.send();
    cantinaToFetch.forEach(async cantina => {
      const cantinaInfo = await getCantina(cantina.trim());
      await postDelayedSlackMessage(response_url, generateSlackMessage(cantinaInfo));
    });
  }
  next();
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

server.listen(8085, function() {
  console.log('%s listening at %s', server.name, server.url);
});