// { example json structure
// 	name: "root"
// 	text: {"text ${}$ "]
// 	values: [
// 		{	
// 			name: "asdf"
// 			text: {""}
// 			values: []
// 		}
// 	]
// }

var json = "";
var linkJSON = "";

function load(username){
    console.log(username);
    $.ajax({
        url: "wikiload",
        type: "get",
        data: {},
        success: function(response) {
            console.log(response);
            json = JSON.parse(response);
            
            var name = json["name"];
            var text = json["text"];
            var values = json["values"];
            
            values.forEach(function(link){
               text = text.replace('${}$', link['name']); 
            });
            
            $('#wiki_body').html(name + "<br><br>" + text);
        },
        error: function (stat, err) {
            console.log(err);
        }       
    });
}

function save(username){
    $.ajax({
        url: "wikisave",
        type: "post",
        data: {text: document.getElementById("wiki_body").innerHTML},
        success: function(response) {
            console.log(response);
        },
        error: function (stat, err) {
            console.log(err);
        }       
    });
}