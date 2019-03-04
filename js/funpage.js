function buttonclick(){
	body = document.getElementById("body");
	body.innerHTML = "clicked";
}

document.onkeypress = function (e){
    console.log("test")
	e = e || window.event;

	console.log(e.keyCode);
}
