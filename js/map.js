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
function newState(){
    state = document.getElementById(arr.pop());
    state.style.fill = "#555555";
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
