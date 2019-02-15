#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express');
var app = express();
var hbs = require('hbs');
var http = require('http');
var request = require('request');
var sync = require('sync-request');

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
    var dict = {
        number : req.query.num,
        fact_arr : get_facts(req.query.num, req.query.num_facts),
    };

    if (req.query.format == "json"){
        var json = "{\"facts\":[";
        dict.fact_arr.forEach(function(fact){
            json += "\"" +  fact.toString().replace(new RegExp("\"", 'g'), "\\\"") + "\",";
        });
        
        res.contentType('application/json');
        res.send(json.substring(0, json.length-1) + "]}");
        //res.json({facts: dict.fact_arr});
    }
    else
        res.render('index', dict);
    //res.send(get_facts(req.query.num, req.query.num_facts));
});

function get_facts(num, num_facts){
    var facts = [];
    var url = "http://numbersapi.com/";
    for (var i = 0; i < num_facts; i++){
        facts.push(sync('GET', url + num).getBody());
    }
    return(facts);
}


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