const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    //set header content type
    res.setHeader('Content-Type', 'text/html');
    let path = '../html/';
    switch(req.url){
        case '/':
            path += 'MainPage.html';
            break;
        default:
            path += '404.html';
            break;       
    }

    //send an html file
    fs.readFile(path, (err, data) => {
        if (err){
            console.log(err);
            res.end();
        } else{
            res.write(data);
            res.end();
        }
    });
});

server.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000');
});