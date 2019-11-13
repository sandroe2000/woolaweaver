;'use strict';

let sourceId = 0, 
    parentId = 0,
    sourceName = "", 
    sourceModified = "",
    arr = [];

$('.modal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let modal = $(this);
    let template = `<i class="${$(button).children().attr('class')}"></i> ${$(button).text().trim()}`;
    modal.find('.modal-title').html(template);
});

const init = async () => {
    
    let i = 0;
    let url = new URL(window.location.href);
    sourceId = url.searchParams.get("folderId");
    arr = [
        {url: "/folders/"+sourceId, callback: setFoldersById}, 
        {url: "/folders/parent/"+sourceId, callback: setFoldersByParent}, 
        {url: "/files/folder/"+sourceId, callback: setFilesByParent}
    ];
    setData(arr[0].url, arr[0].callback);
}

let setData = (url, callback) => {
    
    fetch(url).then(response => {
        return response.text();
    }).then(data => {
        callback(JSON.parse(data));
    });
};

let setFoldersById = (data) => {

    sourceName = data.name;
    sourceModified = data.modified;
    sourceId = data.id;
    if(data.parent){
        parentId = data.parent.id;
    }
    appSetBreadcrumb(data);
    setData(arr[1].url, arr[1].callback);
};

let setFoldersByParent = (data) =>{

    if(data){
        for(let i=0; i<data.length; i++){
            let tr = `<tr>
                        <td scope="col" class="col-4">
                            <a href="/source.html?folderId=${data[i].id}">
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
    setData(arr[2].url, arr[2].callback);
};

let setFilesByParent = (data) =>{

    if(data){
        for(let i=0; i<data.length; i++){
            let tr = `<tr>
                        <td scope="col" class="col-4">
                            <a href="/htmlVisualEditor.html?fileId=${data[i].id}">
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
};

$('#btnModalCreate').on('click', function(event){
    //debugger;
    if($(this).parents('.modal-content').find('.modal-title').text().indexOf('Folder') > 0){
        createFolder();
    }else{
        createFile();
    }
});

function createFolder(){

    let newFolderName = $('#newFolderFileName').val();

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
        $('#modalCreateFolderFile').modal('hide');
        $('#tableSource > tbody').html('');
        init();
        //location.href = 'source.html?folderId='+sourceId;
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation[loading createFolder]: ' + error.message);
    });
}

function createFile(){
    
    let newFileName = $('#newFolderFileName').val();

    if(!newFileName){
        alert('Nome é requerido!');
        return false;
    }

    let json = {
        "name": newFileName, 
        "folder": {
            "id": sourceId
        }
    };

    fetch("/files", { 
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then(response => {
        return response.json();            
    }).then(data => {   
        //let data = JSON.parse(response);
        $('#modalCreateFolderFile').modal('hide');
        location.href = 'htmlVisualEditor.html?fileId='+data.id;
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation[loading createFile]: ' + error.message);
    });
}

(function(){
    init();    
})();