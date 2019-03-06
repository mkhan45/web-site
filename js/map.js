// game starts with no states
// when states are outlined you have to type them as fast as possible
// map fills in over time

var states = document.getElementById("outlines").children;

for (let state of states){
	state.fill = "#00FFFFFF";
}
