function buttonclick(){
	body = document.getElementById("body");
	body.innerHTML = "clicked";
}

document.onKeyPress = function (e){
	e = e || window.event;

	console.log(e.keyCode);
}
