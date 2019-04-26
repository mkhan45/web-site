var cookies = 0;
var session;

load();

function yum(){
    cookies += 1;
    $('#cookies').text(cookies + " cookies");
}

function load(){
    $.ajax({
        url: "cookie_click_data",
        type: "get",
        data: {user: session},
        success: function(response) {
            console.log(response);
            cookies = response.cookies;
            $('#cookies').text(response.cookies + " cookies");
        },
        error: function (stat, err) {
        }       
    })
}

function save(){
    $.ajax({
        url: "cookie_click_saved",
        type: "get",
        data: {user: session, cookies: cookies},
        success: function(response) {
            console.log("saved " + cookies);
        },
        error: function (stat, err) {
        }       
    })
}