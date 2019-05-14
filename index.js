#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express');
var app = express();
var hbs = require('hbs');
var http = require('http');
var request = require('request');
var sync = require('sync-request');
var path = require('path');
var cookieSession = require('cookie-session')
var simpleoauth2 = require("simple-oauth2");
var mysql = require('mysql');
var bodyParser = require('body-parser');

var private_vars = require(path.join(__dirname, '..', 'private', 'private_vars.js') );

var pool = mysql.createPool(sqlvar)
// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM


app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');


app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

express.static.mime.types['wasm'] = 'application/wasm';

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.use(cookieSession({
  name: 'username',                  
  keys: ['abcdefg', '122333444'],
  
  maxAge: 24 * 60 * 60 * 1000 * 30, //30 days
}))

app.get('/', function(req, res){
	res.render('homepage');
});


app.get('/cookie_clicker', function(req, res){
   if(req.session.oauth == null || req.session.username == null){
       res.send("not logged in, <br> <a href='https://user.tjhsst.edu/2020mkhan/oauthlogin'>Log in</a>");
   } else {
       var dict = {
           oauth: req.session.username.toString(),
       };
           res.render("cookie_clicker", dict);
       }
});

function cookie_click_cookies(req, res, next){
    var user = req.session.username;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("Date: ", date);
    pool.query('CALL load_cookies(?, ?)', [user.toString(), date], function (error, results, fields) {
      if (error) {
          res.locals.cookies = error;
          next();
      };
        // CONSTRUCT AND SEND A RESPONSE
            res.locals.cookies = results;
            next();
        });
}

function cookie_click_buildings(req, res, next){
    var user = req.session.username;
    pool.query('SELECT * FROM buildings WHERE s_name=?', [user.toString()], function (error, results, fields) {
      if (error) {
          res.locals.results = error;
          next();
      };
        // CONSTRUCT AND SEND A RESPONSE
            res.locals.buildings = results;
            next();
        });
}

app.get('/cookie_click_data', [cookie_click_cookies, cookie_click_buildings], function(req, res){
    var results = {
        cookies: res.locals.cookies[0][0]["cookie_num"],
        buildings: res.locals.buildings[0],
        diff: res.locals.cookies[0][0]["date_diff"],
    }
    
    console.log(results);
    
    res.json(results);
});

function verify_name(req, res, next){
    var user = req.session.username;
    var cookies = req.query.cookies;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("Date: ", date);
    
    pool.query('SELECT * FROM students WHERE s_name=?', [user.toString()], function(error, results, fields){
        if(results.length == 0){
            console.log("creating row");
            res.locals.needs_update = true;
            next();
        }else{
            res.locals.needs_update = false;
            next();
        }
    });
}

//should be done by procedure
function create_buildings(req, res, next){
    var user = req.session.username;
    var cookies = req.query.cookies;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(res.locals.needs_update);
    if(res.locals.needs_update == true){
       pool.query('INSERT INTO buildings(s_name, grandmas, tractors, planets) VALUE (?, ?, ?, ?)', [user, 0, 0, 0], function(error, results, fields){
           console.log(error)
        next();      
       });
    }else {
        next()
    }
}

function create_students(req, res, next){
    var user = req.session.username;
    var cookies = req.query.cookies;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    if(res.locals.needs_update == true){
        console.log("creating students row");
        pool.query('INSERT INTO students(s_name, cookies, last_login) VALUE (?, ?, ?)', [user, cookies, date], function(error, results, fields){
            next();
        });
    }else{
        next();
    }
}

function cookie_click_save(req, res, next){
    var user = req.session.username;
    var cookies = req.query.cookies;
    
    console.log("here cookies");
    
    pool.query('UPDATE students SET cookies=? WHERE s_name=?', [cookies, user], function(error, results, fields){
        console.log("here cookies 2");
        next();
    });
}

function cookie_building_save(req, res, next){
    var user = req.session.username;
    var buildings = req.query.buildings;
    
    console.log("here");
    
    var grandmas = req.query.buildings.grandmas;
    var tractors = req.query.buildings.tractors;
    var planets = req.query.buildings.planets;
    
    pool.query('UPDATE buildings SET grandmas=?, tractors=?, planets=? WHERE s_name=?', [grandmas, tractors, planets, user], function(error, results, fields){
        console.log(buildings);
        next();
    });
}

app.get('/cookie_click_saved', [verify_name, create_buildings, create_students, cookie_click_save, cookie_building_save], function(req, res){
    res.send("cookies");
});

app.get('/todo', function(req, res){
   if (req.session.username == "2020mkhan"){
       res.sendFile("resources/todo.txt", {root: __dirname});
   } else{
       res.send("no");
   }
});

app.get('/flappy', function(req, res){
    res.render("flappy");
});

app.post('/todoupdate', function(req, res){
    const fs = require('fs');
    console.log(req);
    fs.writeFile(path.join(__dirname, "resources/todo.txt"), req.body.list, function(err) {
        if(err) {
            console.log(err);
            res.send("not saved");
        }
    
        res.send("saved");
        console.log("The file was saved!");
    }); 
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

app.get('/gravity', function(req, res){
	res.render('gravity');
});

app.get('/dog', function(req, res){
	res.sendFile('cat.jpg', { root: __dirname});
});

app.get('/cat', function(req, res){
	res.sendFile('dog.jpg', { root: __dirname});
});

app.get('/survey', function(req, res){
    dict = {
        
    };
   res.render('survey', dict) 
});

var browserScores = {
    "firefox": 0,
    "chrome": 0,
    "vivaldi": 0,
    "opera": 0,
}



app.get('/submit', function(req, res){
    browser = req.query.response;
    
    browserScores[browser] += 1;
    
    dict = {
        scores: browserScores,
    };
    res.render('surveyResults', dict)
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



//login/cookie stuff here

app.get('/content', function(req, res){
    
    var dict = {
        user: req.session.user,
    }
    
    if(req.session.user == null){
        res.send('Content is blocked');
    }else {
        res.render('content', dict);
    }
    
});

function verify_username(req, res, next){
    if (req.query.user !== "blacklisted_username"){
        req.session.user = req.query.user;
    }else {
        req.session.user = null;
    }
    
    next();
}

app.get('/login', [verify_username], function(req, res){
    var dict = {
        username : req.session.user,
    }
    
    if (req.session.user === null){
        res.send("you are blacklisted");
    }
    
    res.render('loginpage', dict);
});

app.get('/reset', function(req, res){
   req.session.user = null;
   res.send('User has been logged out.');
});


//login/cookie stuff ends here


app.get('/funpage', function(req, res){
	if(!req.query.theme)
		req.query.theme = "light";
	dict = {
		theme: req.query.theme
	};
	res.render('funpage', dict);
});


//map stuff here

app.get('/map', function(req, res){
	dict = {};
	res.render('map', dict);
});


var mapscores = {
    "George Washington": 13,
};

function update_score(req, res, next){ //adds score and sorts
    mapscores[req.query.user] = req.query.score;
    
    mapscores[Symbol.iterator] = function* () {  //sorts map by values, found on stackoverflow 37982476
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    } 

    
    console.log(mapscores);
    next();
}

app.get('/mapsubmit', [update_score], function(req, res){
   dict = {
       scores: mapscores,
       user: req.query.user,
   };
   
   res.render('mapsubmit', dict);
});

//map stuff ends here
var ion_client_id = 'aWkzyHDjlQKgj5ZMlBoQxn1M53sBgM8zca1LP0dV';
var ion_client_secret = 'qBxWtJK2MvoeeVkZWkXNONys5axNzCWfI9OKjONIUfCkJwSL8rEsB3VJKmNDD4x4WSAzoo3Foy878fr2IZ8jMbJnFFMuDHuebxzoFpoeLItrpzCqKn8WzKIYEidsLu6L';
var ion_redirect_uri = 'https://user.tjhsst.edu/2020mkhan/login_worker';    //    <<== you choose this one

var oauth2 = simpleoauth2.create({
client: {
    id: ion_client_id,
    secret: ion_client_secret,
},
auth: {
        tokenHost: 'https://ion.tjhsst.edu/oauth/',
        authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
        tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
   }
});

app.get('/scrabble', function(req, res){
   if(req.session.oauth == null){
       res.send("not logged in, <br> <a href='https://user.tjhsst.edu/2020mkhan/oauthlogin'>Log in</a>");
   } else {
       var token = req.session.oauth;
       var dict = {};
       res.render("scrabble", dict);
   }
});

app.get('/oauthcontent', function(req, res){
   if (req.session.oauth == null) {
        res.send("not logged in, <br> <a href='https://user.tjhsst.edu/2020mkhan/oauthlogin'>Log in</a>");
   }else {
        // The above result will now be converted to an AccessToken
        var token = req.session.oauth;
        if (token == null){
            res.send("Not logged in");
        }

        var link = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+token.token.access_token;
        var params = {
            url : link,
            headers : {
                'User-Agent': 'request'
            }
        };
        
       var dict = {};
        request(params, function(error, response, body){
            if(!error && response.statusCode == 200){
                result = JSON.parse(body);
                dict["username"] = result["ion_username"];
                req.session.username = dict["username"];
                dict["name"] = result["display_name"];
                dict["grade"] = result["grade"]["name"];
                res.render("oauth", dict);
            } else {
                res.send("error");
            }
        });  
   }
});

app.get('/oauthlogin', async function(req, res){
        var authorizationUri = oauth2.authorizationCode.authorizeURL({
            scope: "read",
            redirect_uri: ion_redirect_uri
        });
        res.redirect(authorizationUri);
    
});

app.get('/oauthlogout', async function(req, res){
    req.session.oauth = null;
    res.send("logged out <br> <a href='https://user.tjhsst.edu/2020mkhan/oauthlogin'>Log in</a><br><a href='https://user.tjhsst.edu/2020mkhan/'>Homepage</a>");
});

app.get('/login_worker', async function (req, res) {   // <<== async, see line 112
    if (typeof req.query.code != 'undefined') {
        var theCode = req.query.code 
        // .. construct options that will be used to generate a login token
        var options = {
            code: theCode,
            redirect_uri: ion_redirect_uri,
            scope: 'read'
         };
        var result = await oauth2.authorizationCode.getToken(options);
        console.log(result);
        // The above result will now be converted to an AccessToken
        var token = oauth2.accessToken.create(result);
        req.session.oauth = token;

        res.redirect('https://user.tjhsst.edu/2020mkhan/oauthcontent');
    } else {
        res.send('no code attached')
    }
});

app.get('/weather_form', function(req, res){
	res.sendFile('views/ajax.html', {root: __dirname})
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
