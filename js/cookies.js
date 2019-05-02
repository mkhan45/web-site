var cookies = 0;
var cps = 0;
var session;

load();

var buildingCps = {
    grandmas: 1,
    tractors: 3,
    planets: 10,
};

var defaultCosts = {
    grandmas: 10,
    tractors: 50,
    planets: 800,
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
    defaultCosts = {
        grandmas: 10,
        tractors: 50,
        planets: 800,
    };
    
    if(cookies >= buildingCost[building]){
        cookies -= buildingCost[building];
        
        
        if (numBuildings[building] == null){
            numBuildings[building] = 1;
            $(`#${building}`).text(`${building}: ${numBuildings[building]} | ${buildingCost[building]} cookies`);
        }
        else{
            buildingCost = defaultCosts;
            buildingCost[building] = Math.round(buildingCost[building] * Math.pow(1.3, numBuildings[building] - 1));
            numBuildings[building] += 1;
            $(`#${building}`).text(`${building}: ${numBuildings[building]} | ${buildingCost[building]} cookies`);
            updateInfo();
        }
        
        updateCPS();
        $("#cps").text(`${cps} CPS`);
    }
};

function update(){ //runs once a second
    cookies += cps;
    updateInfo();
}

function updateInfo(){
    defaultCosts = {
        grandmas: 10,
        tractors: 50,
        planets: 800,
    };
    $('#cookies').text(cookies + " cookies");
}

function autosave(){ //once every 10 seconds
    save();
}

function load(){
    defaultCosts = {
        grandmas: 10,
        tractors: 50,
        planets: 800,
    };
    buildingCost = defaultCosts;
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
                    
                    buildingCost = defaultCosts;
                    
                    buildingCost[building] = Math.round(defaultCosts[building] * Math.pow(1.3, num - 1));
                    
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
    buildingCost = defaultCosts;
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
            load();
        },
        error: function (stat, err) {
            load();
        }       
    });
}

setInterval(update, 1000);
setInterval(autosave, 10000);