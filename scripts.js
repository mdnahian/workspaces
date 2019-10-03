var isNaming = false;

document.addEventListener('DOMContentLoaded', function() {


    document.getElementById('createWorkspaceBtn').addEventListener('click', function () {
        if (!isNaming) {            
            showfield();
            isNaming = true;
        } else {
            var name = document.getElementById("name").value;

            if(name !== null && name !== ""){
                chrome.tabs.query({currentWindow: true}, function(tabs) {

                    var t = [];
                    for(var i=0; i<tabs.length; i++){
                        t.push(tabs[i].url);
                    }

                    workspace = {
                        "name": name,
                        "tabs": t
                    };

                    create(workspace);

                    document.getElementById("name").value = "";
                    hidefield();
                    isNaming = false;
                });


            } else {
                hidefield();
            }

        }
    });

    
    getWorkspaces();
});


function generateID(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



function showfield() {
    document.getElementById('field-group').className = document.getElementById('field-group').className.replace("is-4 is-offset-6", "");
    document.getElementById('field').style.display = "block";
}

function hidefield() {
    document.getElementById('field-group').className += "is-4 is-offset-6";
    document.getElementById('field').style.display = "none";
}





function create(workspace){
    chrome.storage.sync.get(null, function (data) {

        if(data.workspaces == null){
            chrome.storage.sync.set({"workspaces": [workspace]}, function () {
                getWorkspaces();
            });
        } else {
            var newWorkspaces = data.workspaces;
            newWorkspaces.push(workspace);
            chrome.storage.sync.set({"workspaces": newWorkspaces}, function () {
                getWorkspaces();
            });
        }


    });
}

function update(){
    
}

function remove(){

}

function getUnique(array){
        var uniqueArray = [];
        
        // Loop through array values
        for(i=0; i < array.length; i++){
            if(uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }

function getWorkspaces(){
    chrome.storage.sync.get(null, function (data) {
        var workspaces = data.workspaces;

        if(workspaces != null) {
            var content = "";
            if (workspaces.length > 0) {
                for (var i = 0; i < workspaces.length; i++) {
                    content += '<div class="columns is-mobile"> \
                        <div class="column"> \
                        <div class="name">' + workspaces[i].name + '</div> \
                        </div> \
                        <div class="column has-text-right" style="float:right;display: inline-flex;"> \
                        <a class="button trashBtn" data-id="' + i + '"> \
                        <span class="icon is-small"> \
                        <i class="fa fa-trash" title="delete"></i> \
                        </span> \
                        </a> \
                        <a class="button linkBtn" data-id="' + i + '"> \
                        <span class="icon is-small"> \
                        <i class="fa fa-external-link" title="open all"></i> \
                        </span> \
                        </a> \
                        <a class="button updateBtn" data-id="' + i + '"> \
                        <span class="icon is-small"> \
                        <i class="fa fa-refresh" title="update"></i> \
                        </span> \
                        </a> \
                        </div> \
                        </div>';
                }

                document.getElementById('list').innerHTML = content;


                var trashBtns = document.getElementsByClassName('trashBtn');
                for (var j = 0; j < trashBtns.length; j++) {
                    document.getElementsByClassName('trashBtn')[j].addEventListener('click', function () {
                        var id = parseInt(this.getAttribute("data-id"));
                        console.log(id);
                        chrome.storage.sync.get(null, function (data) {
                            var workspaces = data.workspaces;
                            workspaces.splice(id, 1);
                            chrome.storage.sync.set({"workspaces": workspaces}, function () {
                                getWorkspaces();
                            });
                        });
                    });
                }



                var linkBtns = document.getElementsByClassName('linkBtn');
                for(var k=0; k<linkBtns.length; k++){
                    document.getElementsByClassName('linkBtn')[k].addEventListener('click', function () {
                        var id = parseInt(this.getAttribute("data-id"));
                        chrome.storage.sync.get(null, function (data) {
                            var workspaces = data.workspaces;
                            console.log(workspaces[id].tabs);
                            for(var l=0; l<workspaces[id].tabs.length; l++){
                                chrome.tabs.create({url: workspaces[id].tabs[l]});   
                            }
                        });
                    });
                }

                var updateBtns = document.getElementsByClassName('updateBtn');
                for(var k=0; k<updateBtns.length; k++){
                    document.getElementsByClassName('updateBtn')[k].addEventListener('click', function () {
                        var id = parseInt(this.getAttribute("data-id"));
                        chrome.storage.sync.get(null, function (data) {
                            var workspaces = data.workspaces;
                            console.log(workspaces[id].tabs);
                            console.log(workspaces[id].name);

                            chrome.tabs.query({currentWindow: true}, function(tabs) {

                    var t = [];
                    for(var i=0; i<tabs.length; i++){
                        t.push(tabs[i].url);
                    }

                                                            for(var l=0; l<workspaces[id].tabs.length; l++){
                                t.push(workspaces[id].tabs[l]);
                            }
							
					var uniqueTabs = getUnique(t);		
                    workspace = {
                        "name": workspaces[id].name,
                        "tabs": uniqueTabs
                    };
					workspaces.splice(id, 1,workspace);
					
					chrome.storage.sync.set({"workspaces": workspaces}, function () {
                getWorkspaces();
            });

                    
                });  
                            
                        });
                    });
                }



            } else {
                document.getElementById('list').innerHTML = "No workspaces yet...";
            }
        } else {
            document.getElementById('list').innerHTML = "No workspaces yet...";
        }

    });
}







