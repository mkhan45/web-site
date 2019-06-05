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

var string_content = "";
var values = {"": ""};

var cursor_location = 0;

function keypressed(event){
    var body = document.getElementById("wiki_body");
    string_content = $("#wiki_body").html();
        
    if(event.data == null){ //enter 
        string_content += "\n";
    }
    
    cursor_location = getCaretPosition(body);
    console.log(cursor_location);
    
    
    parse_links();
    $("#wiki_body").html(string_content);
    // placeCaretAtEnd(body);
    // setCaretPosition(body, 5);
    // var sel = window.getSelection();
    // sel.collapse(body.firstChild, caret_pos);
    
    placeCaretAtEnd(body);
    // var sel = window.getSelection();
    // sel.collapse($("#wiki_body").firstChild, getCaretPosition($("#wiki_body")));
}

function cursor_pos(event){
    console.log(event);
    if (event.key == "ArrowLeft"){
        cursor_location -= 1;
        console.log(in_braces(string_content, cursor_location));
    }
}

function parse_links(){
    // {{url|name}} or {{name}}
    
    var current_line = window.getSelection().anchorNode;
    
    if(typeof(current_line) == String){
        current_line = current_line.replace(/{{/g, "");
        current_line = current_line.replace(/}}/g, "");
    }
    console.log(current_line);
    var matches = string_content.match(/{{.+?}}/g);
    
    if(matches){
        matches.forEach(function(match){
            if(!match.includes("|") && current_line != match){
                var new_match = match.replace(/{{/g, "");
                var new_match = new_match.replace(/}}/g, "");
               string_content = string_content.replace(match, `{<u>${new_match}</u>}`);
               var new_content = {
                   name: new_match,
                   text: "",
                   values: [],
               };
               values[new_match.toString()] = new_content;
            }
        });
    }
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function setCaretPosition(el, chars) {
    if (chars >= 0) {
        var selection = window.getSelection();

        var range;
        range = createRange(el.parentNode, { count: chars }, range);

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    // var selection = window.getSelection();
    // selection.removeAllRanges();
    // selection.addRange(range);
};

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

function createRange(node, chars, range) {
    if (!range) {
        range = document.createRange()
        range.selectNode(node);
        range.selectNodeContents(node);
        range.setStart(node, 0);
    }

    if (chars == 0) {
        range.setEnd(node, chars.count);
    } else if (node && chars >0) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.length < chars.count) {
                chars -= node.textContent.length;
            } else {
                range.setEnd(node, chars.count);
                chars = 0;
            }
        } else {
           for (var lp = 0; lp < node.childNodes.length; lp++) {
                range = createRange(node.childNodes[lp], chars, range);

                if (chars.count === 0) {
                    break;
                }
            }
        }
    } 

    return range;
}

function load(username){
    console.log(username);
    $.ajax({
        url: "wikiload",
        type: "get",
        data: {},
        success: function(response) {
            console.log(response);
            var json = JSON.parse(response);
            
            var name = json["name"];
            var text = json["text"];
            string_content = text;
            values = json["values"];
            
            if(values){
                values.forEach(function(link){
                   text = text.replace('${}$', `<u>${link['name']}</u>`); 
                });
            }else{
                values = {};
            }
            
            $('#title').html(name);
            $('#wiki_body').html(text);
            parse_links();
        },
        error: function (stat, err) {
            console.log(err);
        }       
    });
}

function save(username){
    let text = {
      name: $("#title").text(),
      text: $("#wiki_body").text(),
    };
    $.ajax({
        url: "wikisave",
        type: "post",
        data: {text: JSON.stringify(text), user: username},
        success: function(response) {
            console.log(response);
        },
        error: function (stat, err) {
            console.log(err);
        }       
    });
}