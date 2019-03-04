function buttonclick(){
	body = document.getElementById("body");
	body.innerHTML = "clicked";
}

document.onkeypress = function (e){
	e = e || window.event;
	console.log(e);
}
