const restify = require('restify');

const { getCantina, getDefaultCantinas } = require('./cantinas');
const { generateSlackMessage, postDelayedSlackMessage } = require('./slack');

async function cantinas(req, res, next) {
  const response_url = req.body.response_url;
  getDefaultCantinas().forEach(async cantina => {
    const cantinaInfo = await getCantina(cantina);
    postDelayedSlackMessage(response_url, generateSlackMessage(cantinaInfo));
  });
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