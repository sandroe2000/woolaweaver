;'use strict';

$('.modal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let modal = $(this);
    let template = `<i class="${$(button).children().attr('class')}"></i> ${$(button).text().trim()}`;
    modal.find('.modal-title').html(template);
});

$('div.modal-footer > button.btn.btn-primary').on('click', function(event){
   
    let button = $('#modalLabel').text().trim();
    let classIcon = 'fa fa-folder';
    let size = '';
    let link = '';

    if(button.includes('File')){
        classIcon = 'fa fa-file-text-o';
        size = '0 B';
        link = 'textEditorSource.html?fileId=0';
    }

    let template = `<tr>
                        <td>
                            <a href="${link}"><i class="${classIcon}" aria-hidden="true"></i> ${$('#name').val()}</a>
                        </td>
                        <td class="txt-r">${size}</td>
                        <td>${new Date().toLocaleDateString()}</td>
                        <td>${$('#message').val()}</td>
                    </tr>`;

    $('table tbody > tr:first').before(template);
    $('#modalCreateFolder').modal('hide');
});

function showFolder(data){

    let link = "", 
        classIcon = "", 
        name = "", 
        size = "",
        modified = "",
        message = "";

    $('#breadcrumbSource').append(`<li class="breadcrumb-item"><a href="#">project_name</a></li>`);
    if(data.path){
        let path = JSON.parse(data.path);        
        for(let i=0; i<path.length; i++){
            $('#breadcrumbSource').append(`<li class="breadcrumb-item"><a href="http://localhost:3000/source.html?folderId=${path[i].id}">${path[i].name}</a></li>`);
        }
    }
    $('#breadcrumbSource').append(`<li class="breadcrumb-item"><a href="#">${data.name}</a></li>`);

    if(data.folders){
        for(let i=0; i<data.folders.length; i++){
            let tr = `<tr>
                        <td scope="col" class="col-4">
                            <a href="http://localhost:3000/source.html?folderId=${data.folders[i].id}">
                                <i class="fa fa-folder" aria-hidden="true"></i> ${data.folders[i].name}
                            </a>
                        </td>
                        <td scope="col" class="col-2 txt-r"></td>
                        <td scope="col" class="col-2">${data.folders[i].modified}</td>
                        <td scope="col" class="col-4"></td>
                    </tr>`
            $('#tableSource tbody').append(tr);
        }
    }

    if(data.files){
        for(let i=0; i<data.files.length; i++){
            let tr = `<tr>
                        <td scope="col" class="col-4">
                            <a href="http://localhost:3000/htmlVisualEditor.html?fileId=${data.files[i].id}">
                                <i class="fa fa-file-text-o" aria-hidden="true"></i> ${data.files[i].name}
                            </a>
                        </td>
                        <td scope="col" class="col-2 txt-r">${data.files[i].size} KB</td>
                        <td scope="col" class="col-2">${data.files[i].modified}</td>
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

(function(){

    let url = new URL(window.location.href);
    let folderId = url.searchParams.get("folderId");
    getData("/folders/"+folderId, showFolder);
})();