// game starts with no states
// when states are outlined you have to type them as fast as possible
// map fills in over time

var states = document.getElementById("outlines").children;
var arr = [] 

//convert HTML array to javascript array, make all states white
for (let state of states){
	state.style.fill = "#FFFFFF";
	arr.push(state.id);
}

var state;
shuffleArray(arr);   

//shows the next state
function newState(){
    if (arr.length !== 0){
        state = document.getElementById(arr.pop());
        state.style.fill = "#555555";
    }else {
        showScores();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function start(){
    setInterval(newState, 3000);
}

var score = 0;
function verify(){
    var value = (document.getElementById("statebar").value);
    if (value.toUpperCase() == state.id){
        state.style.fill = "#22AA22" //fill the state green
        state = null; //so that you can't just press enter lots of times
        score += 1;
        document.getElementById("score").innerHTML = "Score: " + score;
    }
}

function showScores(){
    
    //kind of sloppy but it works for badges/achievements
    if (score >= 5){
        document.getElementById("map").innerHTML = '<img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>';
    }if (score >= 10){
        document.getElementById("map").innerHTML = '\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        ';
    }if (score >= 30){
        document.getElementById("map").innerHTML = '\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        ';
    }if (score >= 50){
        document.getElementById("map").innerHTML = '\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        <img src="https://cdn1.iconfinder.com/data/icons/tourism-travel-1-3/65/7-512.png"></img>\
        ';
    }
    
    $.ajax({
    		url: "https://user.tjhsst.edu/2020mkhan/mapsubmit?score=" + score + "&user="+document.getElementById("username").value, 
    		type: "get",                         // use a 'get' type request
    		success: function(response) {
    			document.getElementById("score").innerHTML = response;
    		},
    
    		error: function (stat, err) {
    			console.log("error");
    			document.getElementById("score").innerHTML = "error";
    		}
    	});
}
