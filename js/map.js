// game starts with no states
// when states are outlined you have to type them as fast as possible
// map fills in over time

var states = document.getElementById("outlines").children;

states.forEach(function (state){
	state.fill = "#00FFFFFF";
});
