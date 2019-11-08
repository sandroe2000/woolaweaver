;'use strict';

$('#toggleLeftMenu').on('click', function(event){
    $('.main-menu').toggleClass('left-to-right');
    $(this).find('i').toggleClass('mdi-last-page mdi-first-page');
});

$('#toggleRightMenu').on('click', function(event){
    $('.right-menu').toggleClass('right-to-left');
    $(this).find('i').toggleClass('mdi-last-page mdi-first-page');
});

function appSetBreadcrumb(data){
    $('#projectName').html(`project_name`);
    $('#folderOrFileName').html(data.name);

    if(data.path){
        let path = JSON.parse(data.path);        
        for(let i=0; i<path.length; i++){
            $('#breadcrumbSource').append(`<li class="breadcrumb-item"><a href="http://localhost:3000/source.html?folderId=${path[i].id}">${path[i].name}</a></li>`);
        }
    }
    $('#breadcrumbSource').append(`<li class="breadcrumb-item"><a href="#">${data.name}</a></li>`);
}