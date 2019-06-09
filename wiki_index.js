module.exports = function(app){
    var mysql = require('mysql');
    var pool = mysql.createPool(sqlvar);
    var expressWs = require('express-ws')(app);
    
    
    app.get('/wiki', function(req, res){
       if(req.session.oauth == null || req.session.username == null){
           res.send("not logged in, <br> <a href='https://user.tjhsst.edu/2020mkhan/oauthlogin'>Log in</a>");
       } else {
           var dict = {
               oauth: req.session.username.toString(),
           };
               res.render("wiki", dict);
        }
    });
    
    function load_wiki(req, res, next){
        var user = req.session.username;
        pool.query('SELECT wiki FROM wikis WHERE name=?', [user.toString()], function(error, results, fields){
            if(results.length == 0){
                console.log("creating row");
                res.locals.needs_update = true;
                res.locals.wiki = "error";
                next();
            }else{
                res.locals.needs_update = false;
                res.locals.wiki = results;
                next();
            }
        });
    }
    
    app.get('/wikiload', [load_wiki], function(req, res){
        res.json(res.locals.wiki[0].wiki);
    });
    
    app.post('/wikisave', function(req, res){
        var user = req.body.user;
        var text = req.body.text.toString()
        pool.query('UPDATE wikis set wiki=? WHERE name=?', [req.body.text.toString(), user.toString()], function(error, results, fields){
            if(error) console.log(error);
        });
    });
    
    app.ws('/echo', function(ws, req){
       ws.on('message', function(msg){
           var data = null;
           if (msg == "bird")
                data = "bird";
            else if (msg == "pipes")
                data = "pipes";
            else if (msg == "reset")
                data = "reset";
                
            expressWs.getWss().clients.forEach(function(client){
               client.send(data);   
            });
       });
    });
}