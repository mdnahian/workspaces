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
                        <div class="column has-text-right" style="float:right;"> \
                        <a class="button trashBtn" data-id="' + i + '"> \
                        <span class="icon is-small"> \
                        <i class="fa fa-trash"></i> \
                        </span> \
                        </a> \
                        <a class="button linkBtn" data-id="' + i + '"> \
                        <span class="icon is-small"> \
                        <i class="fa fa-external-link"></i> \
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



            } else {
                document.getElementById('list').innerHTML = "No workspaces yet...";
            }
        } else {
            document.getElementById('list').innerHTML = "No workspaces yet...";
        }

    });
}







