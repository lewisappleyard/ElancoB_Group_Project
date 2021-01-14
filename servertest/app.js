const express = require('express');

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');

//listen for request

app.listen(1234);

//middleware & static files
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log('new request made');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

//404 page
app.use((req, res) => {
    res.status(404).render('404');
});

