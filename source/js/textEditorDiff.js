'use strict';

let diffEditor = null;

$(document).ready(function() {
let mock1 = `.main-content {
    position: absolute;
    margin: 5px 0 5px 0;
    padding-top: 10px;
    padding-bottom: 25px;
    top: 10px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #FFF;
    overflow: auto;
}

.main-content::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    border-radius: 12px;
}`;
let mock2 = `.main-content {
    position: absolute;
    margin: 5px 0 5px 0;
    padding-top: 10px;
    padding-bottom: 30px;
	top: 10px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #FFF;
    overflow: auto;
}

.main-content::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    border-radius: 12px;
}

.main-content::-webkit-scrollbar-track {
    background: #F1F1F1;
    border-radius: 12px;
}

.main-content::-webkit-scrollbar-thumb {
    border-radius: 12px;
    background: #C1C1C1;
    border: 3px solid #F1F1F1;
    cursor: pointer;
}

.main-content::-webkit-scrollbar-corner {
    background: #C1C1C1;
}`;

    let originalModel = monaco.editor.createModel(mock1, 'css');
    let modifiedModel = monaco.editor.createModel(mock2, 'css');

    diffEditor = monaco.editor.createDiffEditor(document.querySelector('#editor'));
    diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel
    });

    window.onresize = function () {
        if (diffEditor) {
            diffEditor.layout();
        }
    };
    if(diffEditor) monaco.editor.setTheme('vs');
});

function getData(url){
    return fetch(url).then(function(response) {
        return response.text();
    }).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation[loading Monaco-Editor]: ' + error.message);
    });
}

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