const http = require('http');
const fs = require('fs');
const _ = require('lodash');

const server = http.createServer((req, res) => {
    
    //lodash
    const num = _.random(0, 20);
    console.log(num);

    const greet = _.once(() =>{
        console.log('hello');
    });

    //set header content type
    res.setHeader('Content-Type', 'text/html');
    let path = './html/';
    switch(req.url){
        case '/':
            path += 'MainPage.html';
            res.statusCode = 200;
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
            break;       
    }

    //send an html file
    fs.readFile(path, (err, data) => {
        if (err){
            console.log(err);
            console.log('error found!');
            res.end();
        } else{
            //res.write(data);
            res.statusCode = 200;
            res.end(data);
        }
    });
});

server.listen(1234, 'localhost', () => {
    console.log('listening for requests on port 1234');
});