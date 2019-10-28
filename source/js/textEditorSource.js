'use strict';

let editor = null;

$(document).ready(function() {

    $('#chkRowBorders').prop('indeterminate', true);
    $('#chkColBorders').prop('indeterminate', true);
    /*
    let fileUrl = '/source/css/app.css';

    fetch(fileUrl)
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {

            editor = monaco.editor.create(document.querySelector('#editor'), {
                model: monaco.editor.createModel(data, getModelId(fileUrl))
            });
            window.onresize = function () {
                if (editor) {
                    editor.layout();
                }
            };
            if(editor) monaco.editor.setTheme('vs');
            return "OK";
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation[loading Monaco-Editor]: ' + error.message);
        });
    */
let template = `<div id="row1569535848096" class="row">
    <div id="col1569535852611" class="col-md-12">
        <label id="lbl1569535857424" for="inp1569535859190" class="">Titulo</label>
        <input id="inp1569535859190" type="text" class="form-control">
    </div>
</div>
<div id="row1569535864060" class="row">
    <div id="col1569535864060" class="col-md-12">
        <label id="lbl1569535864060" for="sel1569535877656" class="">Categoria</label>
        <select id="sel1569535877656" class="form-control">
            <option>Selecione uma opção</option>            
        </select>
    </div>
</div>
<div id="row1569535918338" class="row">
    <div id="col1569535920500" class="col-md-12">
        <div class="custom-control custom-switch">
            <input id="ipn1569535926182" type="checkbox" class="custom-control-input" />
            <label id="lbl1569535926182" for="ipn1569535926182" class="custom-control-label mt-1">Label</label>
        </div>
    </div>
</div>
<div id="row1569535916163" class="row">
    <div id="col1569535916163" class="col-md-12 text-right">
        <button id="btn1569535980355" type="button" class="btn btn-light">Cancel</button>
        <button id="btn1569535987469" type="button" class="btn ml-2 btn-primary">Save</button>
    </div>
</div>`;
    
    editor = monaco.editor.create(document.querySelector('#editor'), {
        model: monaco.editor.createModel(template, getModelId('template.html'))
    });
    window.onresize = function () {
        if (editor) {
            editor.layout();
        }
    };
    if(editor) monaco.editor.setTheme('vs');
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