function buttonclick(){
	body = document.getElementById("body");
	body.innerHTML = "clicked";
}

var apresses = 0;
document.onkeypress = function (e){
	e = e || window.event;
	if(e.key == "a"){
		apresses += 1;
		document.getElementById("updown").innerHTML = "A has been pressed " + apresses + " times.";
	}
	console.log(e);
}
