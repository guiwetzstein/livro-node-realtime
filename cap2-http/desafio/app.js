const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});

    const result = url.parse(request.url, true);
    switch (result.pathname) {
        case "/":
        case "/artigos":
            fs.readFile(`${__dirname}/artigos.html`, (erro, html) => {
                response.write(html);
                response.end();
            });
            break;
        case "/contato":
            fs.readFile(`${__dirname}/contato.html`, (erro, html) => {
                response.write(html);
                response.end();
            });
            break;
        default:
            fs.readFile(`${__dirname}/erro.html`, (erro, html) => {
                response.write(html);
                response.end();
            });
    }
});

server.listen(3000, () => {
    console.log('Servidor rodando!');
});
