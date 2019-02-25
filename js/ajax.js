console.log('hi');


function loadWeather(){
	console.log('hi');
	var lat = document.getElementById("lat").value;
	var long = document.getElementById("long").value;
	var urll ="stuff_async?lat="+ lat + "&long=" + long;
	console.log(urll);
	$.ajax({
		url: urll,                      // goes to https://user.tjhsst.edu/pckosek/kitchen
		type: "get",                         // use a 'get' type request
		data:  $('#coord').serialize(), //serialize form and pass to server
		success: function(response) {
			// THIS FUNCTION IS CALLED WHEN KITCHEN IS COMPLETE
			// -- AND -- everthing went ok
			// update the display
			// (bring the order to the customer)
			console.log("error");
			document.getElementById("weather").innerHTML = response;
			$("#weather").html(response.weather);
		},

		error: function (stat, err) {
			// THIS FUNCTION IS CALLED WHEN KITCHEN IS COMPLETE
			// -- BUT -- something went wrong (like invalid menu_item)
			// update the display
			// (bring the explanation to the customer)
			console.log("error");
			document.getElementById("weather").innerHTML = "error";
			$("#weather").html("error");
		}
	});
}
