
const http = require('http');
const fs = require('fs');
const port = 6008;
const ejs = require('ejs');
const querystring = require('querystring');

const requestHandler = (request, response) => {

    const wishes = [
        {value: 'programmer', title: 'Стать хорошим программистом'},
        {value: 'friends', title: 'Найти новых друзей'},
        {value: 'auto', title: 'Купить новый автомобиль'},
        {value: 'love', title: 'Встретить свою любовь'},
        {value: 'cat', title: 'Завести кота'},
        {value: 'sea', title: 'Поехать на море'}
    ];

    if (request.url === '/post' && request.method === 'POST') {

        let body = '';
        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            const jsonData = querystring.parse(body);
            console.log(`Переданные данные: ${body}`);

            jsonData.myWishes = wishes.filter(wish => {
                return jsonData[wish.value];
            });

            console.log(`Данные в JSON: ${JSON.stringify(jsonData)}`);
            ejs.renderFile(`${__dirname}/templates/sent.ejs`, {data: jsonData}, (err, html) => {
                response.end(html);
            });
        });

    } else {

        if (request.url.indexOf('.') !== -1) {

            let cType = "text/html";
            switch (request.url.substr(request.url.lastIndexOf('.'))) {
                case '.js':
                    cType = "text/javascript";
                    break;
                case '.css':
                    cType = "text/css";
                    break;
                case '.jpg':
                    cType = "image/jpeg";
                    break;
                case '.png':
                    cType = "image/png";
                    break;
                case '.svg':
                    cType = "image/svg+xml";
                    break;
            }
            response.setHeader("Content-Type", cType);
            response.end(fs.readFileSync(__dirname + request.url));

        } else {

            response.setHeader("Content-Type", "text/html");
            ejs.renderFile(`${__dirname}/templates/form.ejs`, {wishes: wishes}, (err, html) => {
                response.end(html);
            });
        }
    }
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {

    if (err) {
    return console.log(`Ошибка сервера ${err}`);
}

console.log(`Вишу на порту ${port}`);
});