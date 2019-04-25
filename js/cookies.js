var cookies = 0;
var session;

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
        },
        error: function (stat, err) {
        }       
    })
}

function save(){
    
}