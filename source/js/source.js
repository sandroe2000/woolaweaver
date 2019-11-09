;'use strict';

let sourceId = 0, 
    sourceName = "", 
    sourceModified = "",
    sourceParent = 0,
    sourceFolders = [],
    sourceFiles = [];

$('.modal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let modal = $(this);
    let template = `<i class="${$(button).children().attr('class')}"></i> ${$(button).text().trim()}`;
    modal.find('.modal-title').html(template);
});

function setFoldersById(data){

    sourceName = data.name;
    sourceModified = data.modified;
    sourceId = data.id;

    appSetBreadcrumb(data);
    //TODO - PROMISE ALL
    getData("/folders/parent/"+sourceId, setFoldersByParent);
    getData("/files/folder/"+sourceId, setFilesByParent);
}

function setFoldersByParent(data){

    if(data){
        for(let i=0; i<data.length; i++){
            let tr = `<tr>
                        <td scope="col" class="col-4">
                            <a href="http://localhost:3000/source.html?folderId=${data[i].id}">
                                <i class="fa fa-folder" aria-hidden="true"></i> ${data[i].name}
                            </a>
                        </td>
                        <td scope="col" class="col-2 txt-r"></td>
                        <td scope="col" class="col-2">${data[i].modified}</td>
                        <td scope="col" class="col-4"></td>
                    </tr>`
            $('#tableSource tbody').append(tr);
        }
    }
}
function setFilesByParent(data){
    if(data){
        for(let i=0; i<data.length; i++){
            let tr = `<tr>
                        <td scope="col" class="col-4">
                            <a href="http://localhost:3000/htmlVisualEditor.html?fileId=${data[i].id}">
                                <i class="fa fa-file-text-o" aria-hidden="true"></i> ${data[i].name}
                            </a>
                        </td>
                        <td scope="col" class="col-2 txt-r">${data[i].size} KB</td>
                        <td scope="col" class="col-2">${data[i].modified}</td>
                        <td scope="col" class="col-4"></td>
                    </tr>`
            $('#tableSource tbody').append(tr);
        }
    }
}

function getData(url, callback){
    return fetch(url).then(function(response) {
        return response.text();
    }).then(function(data) {
        callback(JSON.parse(data));
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation[loading getData]: ' + error.message);
    });
}

function createFolder(){

    let newFolderName = $('#newFolderName').val();

    if(!newFolderName){
        alert('Nome é requerido!');
        return false;
    }

    let json = {
        "name": newFolderName, 
        "parent": {
            "id": sourceId
        }
    };

    fetch("/folders", { 
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then(response => {
        return response.json();            
    }).then(response => {   
        $('#modalCreateFolder').modal('hide');
        $('#tableSource > tbody').html('');
        init();
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation[loading createFolder]: ' + error.message);
    });
}

function init(){
    let url = new URL(window.location.href);
    sourceId = url.searchParams.get("folderId");
    getData("/folders/"+sourceId, setFoldersById);
}

(function(){
    init();    
})();