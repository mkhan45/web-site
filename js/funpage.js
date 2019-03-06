function buttonclick(){
    searchbar = document.getElementById("bar")
	body = document.getElementById("body");
	body.innerHTML = searchbar.value;
}

var apresses = 0;
document.onkeypress = function (e){
	e = e || window.event;
	if(e.key == "a"){
		apresses += 1;
		document.getElementById("updown").innerHTML = "a has been pressed " + apresses + " times.";
	}
	console.log(e);
}
