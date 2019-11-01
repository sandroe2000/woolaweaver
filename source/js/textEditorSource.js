;'use strict';

let editor = null;

$(document).ready(function() {
    
    $('#chkRowBorders').prop('indeterminate', true);
    $('#chkColBorders').prop('indeterminate', true);

});

function getModelId(file){    
    let fileExt = file.split('.').pop();    
    if(fileExt=='js') {
        return 'javascript';
    }
    return fileExt;
}

$('#btnVisualEditor').on('click', function(event){
    window.location.href = '/htmlVisualEditor.html?fileId=0';
});

$('#menuTextEditor').on('change', function(event){
    window.location.href=$(this).val();
});

function showFile(data){
 
    editor = monaco.editor.create(document.querySelector('#editor'), {
        model: monaco.editor.createModel(data.content, getModelId(data.name))
    });
    window.onresize = function () {
        if (editor) {
            editor.layout();
        }
    };
    if(editor) monaco.editor.setTheme('vs');
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
    let folderId = url.searchParams.get("fileId");
    getData("/files/"+folderId, showFile);
})();