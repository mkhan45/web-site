var cookies = 0;
var cps = 0;
var session;

load();

var buildingCps = {
    grandmas: 1,
    tractors: 3,
    planets: 10,
};

var buildingCost = {
    grandmas: 10,
    tractors: 50,
    planets: 800,
};

var numBuildings = {};

function yum(){
    cookies += 1;
    $('#cookies').text(cookies + " cookies");
    
    if(cookies == 10){
        save();
        load();
    }
}

function updateBuildings(building){
    if(cookies >= buildingCost[building]){
        cookies -= buildingCost[building];
        
        if (numBuildings[building] == null){
            numBuildings[building] = 1;
            $(`#${building}`).text(`${building}: ${numBuildings[building]} | ${buildingCost[building]} cookies`);
        }else{
            buildingCost[building] = Math.round(buildingCost[building] * 1.3); 
            numBuildings[building] += 1;
            $(`#${building}`).text(`${building}: ${numBuildings[building]} | ${buildingCost[building]} cookies`);
            updateInfo();
        }
        
        updateCPS();
        $("#cps").text(`${cps} CPS`);
    }
};

function update(){ //runs once a second
    cookies += cps
    updateInfo();
}

function updateInfo(){
    $('#cookies').text(cookies + " cookies");
}

function autosave(){ //once every 10 seconds
    save();
}

function load(){
    $.ajax({
        url: "cookie_click_data",
        type: "get",
        data: {user: session},
        success: function(response) {
            cps = 0;
            console.log(response);
            cookies = response.cookies.cookies;
            $('#cookies').text(cookies + " cookies");
            
            $('#buildings').text("");
            
            for(building in response.buildings){
                if(building != "s_name"){
                    var num = response.buildings[building];
                    
                    numBuildings[building] = num;
                    
                    var multiplier = Math.pow(1.3, num - 2);
                    if (multiplier < 1)
                        multiplier = 1;
                    
                    console.log("Multiplier: " + multiplier);
                    
                    buildingCost[building] = Math.round(buildingCost[building] * multiplier);
                    
                    var numText = building + ": " + num + " | " + buildingCost[building] + " cookies";
                    
                    var button = `<button id=\"${building}\" onclick=\"updateBuildings(\'${building}\')\">${numText}</button><br>`;
                    
                    $('#buildings').append(button);
                    
                    cps += buildingCps[building] * response.buildings[building];
                }
            }
            
            $('#cps').text(cps + " CPS");
            
        },
        error: function (stat, err) {
            load();
        }       
    })
}


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
        data: {user: session, cookies: cookies, buildings: numBuildings},
        success: function(response) {
            console.log("saved " + cookies + "\n" + numBuildings);
        },
        error: function (stat, err) {
        }       
    });
}

setInterval(update, 1000);
setInterval(autosave, 10000);