const http = require('http');
const url = require('url');

const server = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'});

  // if (request.url === '/') {
  //   response.write('<h1>Página principal</h1>');
  // } else if (request.url === '/bemvindo') {
  //   response.write('<h1>Bem-vindo :)</h1>');
  // } else {
  //   response.write('<h1>Página não encontrada :(</h1>');
  // }

  response.write('<h1>Dados da query string</h1>');
  const result = url.parse(request.url, true);
  for (var key in result.query)	{
      response.write(`<h2>${key}: ${result.query[key]}</h2>`);
  }

  response.end();
});

server.listen(3000, () => {
    console.log('Servidor rodando!');
});
