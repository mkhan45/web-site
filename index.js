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

app.get('/funpage', function(req, res){
   res.render('funpage');
});

app.get('/stuff_async', function(req, res){
    var params = {
        url : 'https://api.weather.gov/points/',
        headers : {
            'User-Agent': 'request'
        }
    };
    async_facts(req.query.lat, req.query.long, function(data, err){
        if(err)
            res.send(err.toString());
        data = JSON.parse(data);
        params.url = data["properties"]["forecast"]
        var forecast = ""
        
        request(params, function(error, response, body){
           if(!error && response.statusCode == 200){
               var result = body;
               var forecast = JSON.parse(result);
               var data = []
               var periods = forecast["properties"]["periods"];
               console.log(periods);
               
               for (var i = 0; i < periods.length; i++){
                   //console.log("Period: " + period["temperature"]);
                   temp = periods[i]["temperature"];
                   details = periods[i]["detailedForecast"];
                   data.push({
                       "per": periods[i]["name"],
                       "temp": temp,
                       "details": details,
                   });
               }
               
               var dict = {
                   data_arr: data,
               }
               res.render("index", dict);
           } else {
               forecast = "error";
           }
        });
    });
    //res.send(get_facts(req.query.num, req.query.num_facts));
});

function async_facts(lat, long, callback){
    var params = {
        url : 'https://api.weather.gov/points/' + lat + "," + long,
        headers : {
            'User-Agent': 'request'
        }
    };
    
    request(params, function(error, response, body){
       if(!error && response.statusCode == 200){
           result = body;
           callback(result, false);
       } else {
           callback(null, "error");
       }
    });
}

function get_facts(num, num_facts){
    var facts = [];
    var url = "http://numbersapi.com/";
    for (var i = 0; i < num_facts; i++){
        facts.push(sync('GET', url + num).getBody());
    }
    return(facts);
}

app.get('/:page', function(req, res){
    var dict = {
        number : req.params.page,
        fact_arr : get_facts(req.params.page, req.query.num_facts),
    };

    if (req.query.format == "json"){
        var json = "{\"facts\":[";
        dict.fact_arr.forEach(function(fact){
            json += "\"" +  fact.toString().replace(new RegExp("\"", 'g'), "\\\"") + "\",";
        });
        
        res.contentType('application/json');
        res.send(json.substring(0, json.length-1) + "]}");
        //res.send(JSON.parse(JSON.stringify(dict.fact_arr)));
    }
    else
        res.render('index', dict);
    //res.send(get_facts(req.query.num, req.query.num_facts));
});



// app.get('/:page', function(req, res){

//     var info = {
//         page : req.params.page
//     };

//     res.json(info)
// });

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});