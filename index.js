#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express');
var app = express();
var hbs = require('hbs');


// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM

app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');


// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function(req, res){
    res.send('<h1>hi</h1>');
});

app.get('/foo', function(req, res){
    res.send('requested foo');
});

app.get('/not_a_search', function(req, res){
    var theQuery = req.query.q;
    res.send('query parameter:' + theQuery);
});

app.get('/is_a_search', function(req, res){
    var query = req.query.q;
    res.send('You searched:' + query);
});

app.get('/fish', function(req, res){
   res.sendFile('index.html', { root: __dirname});
});

app.get('/dog', function(req, res){
   res.sendFile('cat.jpg', { root: __dirname});
});

app.get('/cat', function(req, res){
   res.sendFile('dog.jpg', { root: __dirname});
});

app.get('/pet', function(req, res){
   var query = req.query.q;
   switch (query){
        case 'dog':
            res.sendFile('dog.jpg', { root: __dirname});
            break;
        case 'cat':
            res.sendFile('cat.jpg', { root: __dirname});
   }
});

app.get('/stuff', function(req, res){

    var facts = new Array(req.query.num_facts);
    for (i in num_facts){
        var url = "http://numbersapi.com/" + req.query.num;
        var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                facts.push(document.querySelector('pre').innerHTML);
            }
        };
    }

    var dict = {
        number : req.query.num,
        fact_arr : facts,
    };

    res.render('index', dict);
});

app.get('/:page', function(req, res){

    var info = {
        page : req.params.page
    };

    res.json(info)
});

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});