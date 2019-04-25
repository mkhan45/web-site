var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.1.1/handlebars.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

var result_template = `
	<link rel="stylesheet" type="text/css" href="css/scrabble.css">
            {{#each words}}
                <div class="placeholder"></div>
                <div class="letter">
                    <div class="key">
                        <b>
                        {{@key}} 
                        </b>
                    </div>
                    
                    <div class="words_boxed">    
                        {{this}}
                    </div>
                </div>
                <div class="placeholder"></div>
            {{else}}
            error
            {{/each}}
`;

var min_digits = 2;
var specified_position = false;

function go(){
    var letters = document.getElementById("letters").value.split('');
    var word = "";
    
    specified_position = document.getElementById("character").value != "" && document.getElementById("position").value != "";
    console.log(specified_position);
    
    jQuery.get('resources/enable1.txt', function(data) {
        var words = data.split("\n");
        word += words.reduce(validWord);
        word = word.substring(2)
        words = word.split("<br>")
        
        var categories = new Set();
        
        words.forEach(function(word){
           categories.add(word.substring(0,1)); 
        });
        
        categories = Array.from(categories);
        
        categories.pop();
        
        var start_letters = {};
        
        categories.forEach(function(start_letter){
            if(start_letters[start_letter.toUpperCase()] == null){
                start_letters[start_letter.toUpperCase()] = [];
            }
        
        console.log(start_letters);
        
        
        var word_list = words.filter(function(word){
                              return word.substring(0, 1) == start_letter;
                         }).toString().toUpperCase().replace(/,/g, "\n");
        
        console.log(word_list)
           start_letters[start_letter.toUpperCase()].push(word_list); 
        });
        
        console.log(start_letters);
        
        
        var template = Handlebars.compile(result_template);
        var context = {
            words: start_letters,
        };
        
        
        console.log(context);
        console.log(template(context));
        var html = template(context);
        document.getElementById("words").innerHTML = html;
        document.getElementById("words").style.opacity = 1;
    });
    
    return false;
}

function validWord(accumulator, word, index, array){
    
    min_digits = document.getElementById("digits").value.trim();
    var word_letters = word.split('');
    var letters = document.getElementById("letters").value.toLowerCase().split('');
    
    var num_wildcards = (document.getElementById("letters").value.match(/\*, /g) || []).length; //doesn't work
    console.log("Num wildcards = " + num_wildcards);
    var needed_wildcards = 0;
    
    var valid = true;
    word_letters.forEach(function(letter){
        if (!letters.includes(letter)){
            needed_wildcards += 1;
            if (needed_wildcards > num_wildcards){
                valid = false;
            }
        }else if (specified_position === true){
            var position = document.getElementById("position").value.trim();
            var character = document.getElementById("character").value.trim();
            
            if(word.charAt(position) != character){
                valid = false;
            }
        }
        remove_letter(letters, letter);
    });
    
    if (valid && word.length >= min_digits){
        return accumulator + word + "<br>";
    }else {
        return accumulator;
    }
}

function remove_letter(arr, letter){
    for( var i = 0; i < arr.length; i++){ 
        if ( arr[i] === letter) {
            arr.splice(i, 1); 
   }
}
}