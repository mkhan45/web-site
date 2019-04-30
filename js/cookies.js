var cookies = 0;
var cps = 0;
var session;

load();

var buildingCps = {
    grandmas: 1,
    tractors: 5,
    planets: 25,
};

var numBuildings = {};

function yum(){
    cookies += 1;
    $('#cookies').text(cookies + " cookies");
}

function update(){ //runs once a second
    
}

function load(){
    $.ajax({
        url: "cookie_click_data",
        type: "get",
        data: {user: session},
        success: function(response) {
            console.log(response);
            cookies = response.cookies.cookies;
            $('#cookies').text(cookies + " cookies");
            
            $('#buildings').text("");
            
            for(building in response.buildings){
                if(building != "s_name"){
                    var num = response.buildings[building];
                    
                    numBuildings[building] = num;
                    
                    var numText = building + ": " + num;
                    
                    
                    var button = `<button id=\"${building}\" onclick=\"updateBuildings(\'${building}\')\">${numText}</button><br>`;
                    
                    $('#buildings').append(button);
                    
                    cps += buildingCps[building] * response.buildings[building];
                }
            }
            
            $('#cps').text(cps + " CPS");
            
        },
        error: function (stat, err) {
        }       
    })
}

function updateBuildings(building){
    if (numBuildings[building] == null){
        numBuildings[building] = 1;
        $(`#${building}`).text(`${building}: ${numBuildings[building]}`);
    }
    else{
        numBuildings[building] += 1;
        $(`#${building}`).text(`${building}: ${numBuildings[building]}`);
    }
    
    updateCPS();
    $("#cps").text(`${cps} CPS`);
};

function updateCPS(){
    cps = 0;
    for(building in buildingCps){
        cps += buildingCps[building] * numBuildings[building];
    }
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