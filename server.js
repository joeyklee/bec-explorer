var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");

var mongojs = require('mongojs');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var MONGOCONNECTION =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost:27017/bec-explorer';
var db = mongojs(MONGOCONNECTION);

function mongoError(res, err) {
    if (err) console.error('mongo error ->', err);
    return res.status(500).send('internal server error')
};

function findAll(collection, query, res) {
    collection.find(
        query,
        function(err, docs) {
            if (err) {
                return mongoError(res, err);
            };
            // if nothing is found (doc === null) return empty array
            res.send(docs === null ? [] : docs);
        }
    );
};

app.use('/', express.static('views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// var grid = db.collection('co2grid');
// grid data
app.get('/api/test', function(req, res) {
    // findAll(grid, {}, res);
    console.log("Hello stranger");
});




app.get('/', function(req, res) {
    // res.send('Hello World!');
    res.render('index');
});

app.get('/contact', function(req, res) {
    // res.send('Hello World!');
    res.render('contact');
});

app.get('/api', function(req, res) {
    // res.send('Hello World!');
    res.render('api');
});

app.get('/current', function(req, res) {
    // res.send('Hello World!');
    res.render('current');
});

app.get('/about', function(req, res) {
    // res.send('Hello World!');
    res.render('about');
});


app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
