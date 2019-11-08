;
'use strict';

$('#menuTextEditor').on('change', function(event){
    window.location.href=$(this).val();
});

$('#sideBarForm').click(function(event){
    $('.sideBarForm').toggleClass('hide');
});

$('#sideBarLayout').click(function(event){
    $('.sideBarLayout').toggleClass('hide');
});

$('#sideBarComponents').click(function(event){
    $('.sideBarComponents').toggleClass('hide');
});

$('#closeRightmenu').click(function(event){
    $('main').toggleClass('data-active');
    $('data').toggleClass('data-on');
    $(this).toggleClass('mdi-last-page mdi-first-page');
    monacoEditor.layout();
});

let fileName = "";
let folderId = 0;
let fileId = 0;
let url = "/files";
let contador = 1;
let row = `<div class="form-row" id="${contador}">
                <div class="col-md-4 mt-2">
                    <input type="text" class="form-control form-control-sm" id="label" />
                </div>
                <div class="col-md-3 mt-2">
                    <select class="form-control form-control-sm" id="type">
                        <option disabled>Single value</option>
                        <option>Text</option>
                        <option>Text(Mult lines)</option>
                        <option>File</option>
                        <option>CheckBox</option>
                        <option>Currency</option>
                        <option>Date</option>
                        <option>Date and Time</option>
                        <option>Dropdown</option>
                        <option>Email</option>
                        <option>Location</option>
                        <option>Number(Integer)</option>
                        <option>Number(Decimal)</option>
                        <option>Phone</option>
                        <option>Time</option>
                        <option>User reference</option>
                        <option disabled>Complex types</option>
                        <option>Data reference</option>
                        <option>Field group</option>
                        <option>Field group(Repeating)</option>
                    </select>
                </div>
                <div class="col-md-3 mt-2">
                    <select class="form-control form-control-sm" id="type">
                        <option>Optional</option>
                        <option>Required</option>
                    </select>
                </div>
                <div>
                    <button class="btn btn-light btn-sm mt-2" type="button">
                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-light btn-sm mt-2" type="button" onclick="removeRow(this)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>`;

$('#modalCreate').on('show.bs.modal', function (event) {
    
    let button = $(event.relatedTarget);
    let modal = $(this);
    let clazz = $(button).children().attr('class') || $(button).attr('class');
    let titleTemplate = `<i class="${clazz}"></i> ${$(button).text().trim()}`;
    let bodytemplate = `<div class="row">
                            <div class="col-md-12 fieldsContainer"></div>
                        </div>`;
    modal.find('.modal-title').html(titleTemplate);
    modal.find('.modal-body form').html(bodytemplate);

    $('#addField').on('click', function(event){
        $('.fieldsContainer').append(row);
    });
    
    $('#menuToggle').on('click', function(event){
        $('.main-menu').toggleClass('left-to-right');
        $(this).find('i').toggleClass('mdi-last-page mdi-first-page');
    });

    $('#addField').trigger('click');
});

function removeRow(btn){ 
    $(btn).parents('.form-row').remove();
}

////////////////// MONACO /////////////////////
let monacoEditor = null;

function getData(url, callback){
    return fetch(url).then(function(response) {
        return response.text();
    }).then(function(data) {
        callback(JSON.parse(data));
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation[loading getData]: ' + error.message);
    });
}

function setMonaEditor(data){

    appSetBreadcrumb(data);
    fileName = data.name;
    folderId = data.folder.id;
    
    monacoEditor = monaco.editor.create(document.querySelector('.main-editor'), {
        model: monaco.editor.createModel(data.content, getModelId(data.name))
    });

    window.onresize = function () {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    };

    if(monacoEditor) monaco.editor.setTheme('vs');
}

function getModelId(file){    
    let fileExt = file.split('.').pop();    
    if(fileExt=='js') {
        return 'javascript';
    }
    return fileExt;
}

$('#btnTextEditor').on('click', function(event){
    //window.location.href = '/textEditorSource.html?fileId=0';
    $('div.main-content').toggleClass('block');
    $('div.main-editor').toggleClass('hide');
       
    if($('div.main-content').hasClass('block')){
        getContentFromMonaco();
    }
    if(!$('div.main-editor').hasClass('hide')){
        setContentToMonaco();    
    }
});

function getContentFromMonaco(){    
    //$('div.main-content').click();
    let edit = document.createElement('div');
        edit.setAttribute('class', 'main-content container-fluid edit block');
        edit.innerHTML = monacoEditor.getValue();
    loadContentNode(edit); 
}

function setContentToMonaco(){    
    //TODO -- DISABLE DRAG N DROP MENU, COL BORDER, ROW BORDERS;
    let content = $('div.main-content').html();
    monacoEditor.setValue(content);
    monacoEditor.layout();
}

$('#modalEndPoint').on('show.bs.modal', function (event) {
    wwEndpoint.init();
});

$('#btnOkEndpointFiels').click(function(event){
    console.log('Gravando EndpointFiels...');
});

//////////////////////////////////////////////////////////////////

const $pathTarget = document.querySelectorAll('.path');
const $source = document.querySelector('#json-renderer');

const defaultOpts = {
    pathNotation: 'dots',
    pathQuotesType: 'single',
    pickerIcon: '#x7f7'
};

function transformJson(event) {

    let url = $('#inpEndpointURI').val();

    fetch(url).then(function(response) {
        return response.text();
    }).then(function(data) {
        JPPicker.render($source, JSON.parse(data), $pathTarget, defaultOpts);
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });

    //event.preventDefault();
}

function setEndpointField(){

    let inpEndpointField = $('#inpEndpointField').val();
    let selEndpointFieldType = $('#selEndpointFieldType').val();

    if(!inpEndpointField || !selEndpointFieldType){
        return false;
    }

    let tr = `<tr>
        <td class="col-w-10"></td>
        <td class="col-w-20">${selEndpointFieldType}</trd>
        <td class="col-w-50">${inpEndpointField}</td>
        <td class="text-nowrap text-right">
            <i class="ml-3 fa fa-lg fa-trash" aria-hidden="true"></i>
            <i class="ml-3 fa fa-lg fa-pencil-square-o" aria-hidden="true"></i>
        </td>
    </tr>`;
    
    $('#tableEndpointFields tbody').append(tr);

    $('#inpEndpointField').val('');
    $('#selEndpointFieldType').val('');
}

$('#htmlVisualEditorBtnCommit').on('click', function(event){

    if($('div.main-content').hasClass('block')){
        setContentToMonaco();
    }

    let headers = {
        "Content-Type": "application/json"
    };

    let json = {
        "id": fileId,
        "name": fileName,
        "content": monacoEditor.getValue(),
        "folder": {
            "id": folderId
        }
    };
    
    fetch("/files/"+fileId, { 
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then(response => {
        return response.json();            
    }).then(response => {
        //TODO    
        alert('ATUALIZADO...');
    });
});

(function(){
    url = new URL(window.location.href);
    fileId = url.searchParams.get("fileId");
    getData("/files/"+fileId, setMonaEditor);
})();

