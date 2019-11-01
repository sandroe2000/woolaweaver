;
'use strict';

$( window ).resize(function() {
    let menuH = $('data').height() - 40;
    $('#menuForm').css({
        'max-height': menuH
    });
});

let inputArr = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week'];

let numberTemplate = `<div class="form-row mb-2">
                        <div class="col-4 text-right">
                            <label for="idInput">Min:</label>
                        </div>
                        <div class="col-8">
                            <input id="min" type="number" class="form-control" value="0" />
                        </div>
                    </div>
                    <div class="form-row mb-2">
                        <div class="col-4 text-right">
                            <label for="idInput">Max:</label>
                        </div>
                        <div class="col-8">
                            <input id="min" type="number" class="form-control" value="0" />
                        </div>
                    </div>`;

let rowsTemplate = `<div class="form-row mb-2">
                        <div class="col-12">
                            <label for="idInput">Rows:</label>
                            <input id="txtRows" type="number" class="form-control" value="0" min="2" max="30" />
                        </div>
                    </div>`;

let labelTemplate = `<div class="form-row mb-2">
                        <div class="col-12">
                            <label for="idInput">Label:</label>                            
                            <div class="input-group input-group-sm">
                                <input id="labelInput" type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="button">
                                        <i class="fa fa-check" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row mb-2">
                        <div class="col-12">
                            <div class="custom-control custom-switch">
                                <input id="bold" type="checkbox" class="custom-control-input" />
                                <label for="bold" class="custom-control-label mr-2">Bold</label>
                            </div>
                        </div>
                    </div>`;

let orientationTemplate = `<div class="form-row mb-2">
                                <div class="col-12">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" id="vertical" name="orientation" class="custom-control-input" checked />
                                    <label class="custom-control-label" for="vertical">Vertical</label>
                                </div>
                                    <div class="custom-control custom-radio">
                                        <input type="radio" id="horizontal" name="orientation" class="custom-control-input" />
                                        <label class="custom-control-label" for="horizontal">Horizontal</label>
                                    </div>
                                </div>
                            </div>`;

let idTemplate = `<div class="form-row mb-2">
                    <div class="col-12">
                        <label for="idInput">Id:</label>                        
                        <div class="input-group input-group-sm">
                            <input id="elementId" type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" />
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="button">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;

let colTemplate = `<div class="form-row mb-2">
                <div class="col-12">
                    <label for="colGrid">Col Grid:</label>                        
                    <div class="input-group input-group-sm">
                        <select id="colGrid" class="form-control" aria-describedby="inputGroup-sizing-sm">
                            <option value="col-md-1">col-md-1</option>
                            <option value="col-md-2">col-md-2</option>
                            <option value="col-md-3">col-md-3</option>
                            <option value="col-md-4">col-md-4</option>
                            <option value="col-md-5">col-md-5</option>
                            <option value="col-md-6">col-md-6</option>
                            <option value="col-md-7">col-md-7</option>
                            <option value="col-md-8">col-md-8</option>
                            <option value="col-md-9">col-md-9</option>
                            <option value="col-md-10">col-md-10</option>
                            <option value="col-md-11">col-md-11</option>
                            <option value="col-md-12">col-md-12</option>
                        </select>
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row mb-2">
                <div class="col-12">
                    <div class="custom-control custom-switch mt-2">
                        <input id="colAlign" type="checkbox" class="custom-control-input" />
                        <label for="colAlign" class="custom-control-label mr-2">Align Right</label>
                    </div>
                </div>
            </div>`;
                
let selectTemplate = `<div class="form-row mb-2">
                <div class="col-12">
                    <label for="endPoint">EndPoint:</label>
                    <div class="input-group input-group-sm">
                        <select class="custom-select" id="endPoint" aria-describedby="inputGroup-sizing-sm">
                            <option selected>Selecione uma opção</option>
                        </select>
                        <div class="input-group-append">
                            <button class="btn btn-light" type="button" style="border: 1px solid #dfe1e6" data-toggle="modal" data-target="#modalEndPoint">
                                <i class="fa fa-link" aria-hidden="true">
                                    <span style="display:none">Entity</span>
                                </i>
                            </button>
                        </div>
                    </div>                                            
                </div>
            </div>
            <div class="form-row mb-2">
                <div class="col-12">
                    <label for="selectValue">Value:</label>                        
                    <div class="input-group input-group-sm">
                        <select id="selectValue" class="form-control" aria-describedby="inputGroup-sizing-sm">
                            <option value="">Selecione uma opção</option>
                        </select>
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row mb-2">
                <div class="col-12">
                    <label for="selectText">Text:</label>                        
                    <div class="input-group input-group-sm">
                        <select id="selectText" class="form-control" aria-describedby="inputGroup-sizing-sm">
                            <option value="">Selecione uma opção</option>
                        </select>
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fa fa-check" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">                        
                <div class="col-12">
                    <div class="custom-control custom-switch">
                        <input id="multiple" type="checkbox" class="custom-control-input" />
                        <label for="multiple" class="custom-control-label mb-2 mt-2 mr-2">Multiple</label>
                    </div>
                </div>
            </div>`;

let placeholderTemplate = `<div class="form-row mb-2">
                                <div class="col-12">
                                    <label for="placeholder">Placeholder:</label>                                    
                                    <div class="input-group input-group-sm">
                                        <input id="placeholder" type="text" class="form-control" aria-describedby="inputGroup-sizing-sm" />
                                        <div class="input-group-append">
                                            <button class="btn btn-primary" type="button">
                                                <i class="fa fa-check" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

let marginTemplate = `<div class="form-row">
                        <div class="col-6">
                            <label>Margins:</label>
                        </div>
                    </div>                        
                    <div class="form-row">
                        <div class="col-6">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="mdi mdi-arrow-upward" style="font-size:16px"></i></div>
                                </div>
                                <input id="mt" type="number" class="form-control" value="0" min="0" max="4" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="mdi mdi-arrow-downward" style="font-size:16px"></i></div>
                                </div>
                                <input id="mb" type="number" class="form-control" value="0" min="0" max="4" aria-describedby="inputGroup-sizing-sm" />
                            </div>                                
                        </div>
                    </div>
                    <div class="form-row mb-2">
                        <div class="col-6">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="mdi mdi-arrow-back" style="font-size:16px"></i></div>
                                </div>
                                <input id="ml" type="number" class="form-control" value="0" min="0" max="4" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="input-group input-group-sm mb-2">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="mdi mdi-arrow-forward" style="font-size:16px"></i></div>
                                </div>
                                <input id="mr" type="number" class="form-control" value="0" min="0" max="4" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>`;

let btnTemplate = `<div class="form-row">                        
                        <div class="col-12">
                            <div class="custom-control custom-switch">
                                <input id="outline" type="checkbox" class="custom-control-input" />
                                <label for="outline" class="custom-control-label mr-2">Outline</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row mt-2">                        
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="light" name="colors" class="custom-control-input" checked />
                                <label class="custom-control-label" for="light">Light</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="secondary" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="secondary">Secondary</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="success" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="success">Success</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="danger" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="danger">Danger</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="warning" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="warning">Warning</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="info" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="info">Info</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-row mb-2">
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="primary" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="primary">Primary</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="dark" name="colors" class="custom-control-input" />
                                <label class="custom-control-label" for="dark">Dark</label>
                            </div>
                        </div>
                    </div>`;

function setContextmenu() {
    document.querySelector('.main-content.container-fluid.edit').removeEventListener('contextmenu', initContextMenu, false);
    document.querySelector('.main-content.container-fluid.edit').removeEventListener("click", initRightMenu, false);
    document.querySelector('.main-content.container-fluid.edit').addEventListener('contextmenu', initContextMenu, false);
    document.querySelector('.main-content.container-fluid.edit').addEventListener("click", initRightMenu, false);
}

function initContextMenu(event){
    createContexMenu(event);
    event.preventDefault();
}
function initRightMenu(event){
    $("#context-menu").hide('fast');
    $("#context-menu").html('');
    showMenuLabel(event);
    showMenuButton(event);
    showMenuInput(event);
    showMenuTextarea(event);
    showMenuSelect(event);
    showMenuRadioCheck(event);
    showMenuColumn(event);

}

function showRightMenu(){
    if(!$('main').hasClass('data-active')){
        $('main').toggleClass('data-active');
        $('data').toggleClass('data-on');
    }
}

function showMenuColumn(event){
    if (!event.target.getAttribute('class').includes('col-md-')) return false;
    showRightMenu();
    let clicked = event.target.id;
    let label = `<form><div style="padding:10px">
            <h5>Col Grid</h5>
            <hr />
            ${idTemplate}
            ${colTemplate}
            ${marginTemplate}`;    
    $('#menuForm').html(label);
    $('#menuForm').attr('clickedId', clicked);    
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function showMenuLabel(event){
    if (event.target.tagName != 'LABEL') return false;
    showRightMenu();
    let clicked = event.target.id;
    let label = `<form><div style="padding:10px">
            <h5>Label</h5>
            <hr />
            ${idTemplate}
            ${labelTemplate}
            ${marginTemplate}`;    
    $('#menuForm').html(label);
    $('#menuForm').attr('clickedId', clicked);    
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function showMenuButton(event){
    if (!event.target.classList.contains("btn")) return false;
    showRightMenu();
    let clicked = event.target.id;
    let menuH = $('data').height() - 40;
    let btn = `<h5>Button</h5>
            <hr />
            ${idTemplate}
            ${labelTemplate}
            ${btnTemplate}
            ${marginTemplate}`;    
    $('#menuForm').html(btn);
    $('#menuForm').attr('clickedId', clicked);  
    $('#menuForm').css({
        'max-height': menuH
    });
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function showMenuInput(event){
    if (inputArr.indexOf(event.target.type) < 0) return false;
    showRightMenu();
    let clicked = event.target.id;
    let input = `<h5>Input ${event.target.type}</h5>
            <hr />
            ${idTemplate}
            ${placeholderTemplate}
            ${marginTemplate}`;    
    $('#menuForm').html(input);
    $('#menuForm').attr('clickedId', clicked);    
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function showMenuTextarea(event){
    if (event.target.type != 'textarea') return false;
    showRightMenu();
    let clicked = event.target.id;
    let input = `<h5>Textarea</h5>
            <hr />
            ${idTemplate}
            ${rowsTemplate}
            ${marginTemplate}`;    
    $('#menuForm').html(input);
    $('#menuForm').attr('clickedId', clicked);    
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function showMenuSelect(event){

    if (event.target.type == undefined){
        return false;
    } 
    if(event.target.type != 'select-one' && event.target.type != 'select-multiple'){ 
        return false;
    }

    showRightMenu();
    let clicked = event.target.id;
    let input = `<h5>Select</h5>
        <hr />
        ${idTemplate}
        ${selectTemplate}
        ${marginTemplate}`;    
    $('#menuForm').html(input);
    $('#menuForm').attr('clickedId', clicked);    
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function showMenuRadioCheck(event){
    
    let valid = false;
    if (event.target.classList.contains("custom-control-label")) {
        valid = true;
    }
    if(event.target.type == 'radio'){
        valid = true;
    } 
    let clicked = event.target.id;
    if(event.target.classList.contains("custom-switch") || event.target.classList.contains("form-check")){
        valid = true;
        clicked = event.target.firstElementChild.id;
    }
    if(!valid) return false;

    showRightMenu();
    let type = document.querySelector(`#${clicked}`).type || 'checkbox';
    let input = `<h5>Input ${type}</h5>
        <hr />
        ${idTemplate}
        ${labelTemplate}
        ${orientationTemplate}
        ${marginTemplate}`;    
    $('#menuForm').html(input);
    $('#menuForm').attr('clickedId', clicked);    
    loadClicked('#menuForm', clicked);
    changeClick('#menuForm', clicked);
}

function createContexMenu(event){
    
    let alt = 200;

    let template = '';
    let col = `<a class="dropdown-item" href="#" onclick="changeColSize();">
            <i class="mdi mdi-compare-arrows"></i> <span style="position:absolute;margin:5px 10px">Switch Column Size</span>
            </a>
            <a class="dropdown-item" href="#" onclick="changeColAlign();">
            <i class="mdi mdi-compare-arrows"></i> <span style="position:absolute;margin:5px 10px">Switch Column Align</span>
            </a>`;

    let input = `<form style="margin:10px">
                    <h5>Input ${event.target.type}</h5>
                    <hr />
                    ${idTemplate}
                    ${placeholderTemplate}
                    ${marginTemplate}
                </form>`;
    let textarea = `<form style="margin:10px">
                    <h5>Textarea</h5>
                    <hr />
                    ${idTemplate}
                    ${rowsTemplate}
                    ${marginTemplate}
                </form>`;
    let checkOrRadio = `<form style="margin:10px">
                    <h5>Input ${event.target.type || 'checkbox'}</h5>
                    <hr />
                    ${idTemplate}
                    ${labelTemplate}
                    ${orientationTemplate}
                    ${marginTemplate}
                </form>`;
    let number = `<form style="margin:10px">
                    <h5>Input ${event.target.type}</h5>
                    <hr />
                    ${idTemplate}
                    ${numberTemplate}
                    ${marginTemplate}
                </form>`;
    let btn = `<form style="margin:10px">
                    <h5>Button</h5>
                    <hr />
                    ${idTemplate}
                    ${labelTemplate}
                    ${btnTemplate}
                    ${marginTemplate}
                </form>`;
    let label = `<form style="margin:10px">
                    <h5>Label</h5>
                    <hr />
                    ${idTemplate}
                    ${labelTemplate}
                    ${marginTemplate}
                </form>`;
    let select = `<form style="margin:10px">
                <h5>Select</h5>
                <hr />
                ${idTemplate}
                ${selectTemplate}
                ${marginTemplate}
            </form>`;

    if (event.target.tagName == 'LABEL') {
        template = label;
    }
    if (event.target.type == 'textarea') {
        template = textarea;
    }
    if (inputArr.indexOf(event.target.type) >= 0) {
        template = input;
    }
    if (event.target.classList.contains("custom-control-label")) {
        template = checkOrRadio;
    }
    if (event.target.type == 'radio') {
        template = checkOrRadio;
    }
    if (event.target.type == 'number') {
        template = number;
    }
    if (event.target.classList.contains("col-md-6") || event.target.classList.contains("col-md-12")) {
        template = col;
    }
    if (event.target.classList.contains("btn")) {
        template = btn;  
    }
    if(event.target.type == 'select-one' || event.target.type == 'select-multiple'){
        template = select;  
    }
    if (!template) {
        $("#context-menu").hide('fast');
        return false;
    }

    $('#menuForm').html('');
    $("#context-menu").html(template);

    let menuH = new Number($('#context-menu').css('height').replace('px', ''));
    let menuW = new Number($('#context-menu').css('width').replace('px', ''));

    let wiH = window.innerHeight;
    let wiW = window.innerWidth; //new Number($('.edit').css('width').replace('px', ''));
   
    let top = event.pageY + 5;
    let left = event.pageX + 5;

    if((event.pageY + menuH) > wiH){
        top = (wiH - menuH);
    }

    if((event.pageX + menuW) > wiW){
        left = (event.pageX - (menuW+5));
    }
    
    $("#context-menu").attr('clickedId', event.target.id);
    $("#context-menu").css({
        display: "block",
        top: top,
        left: left
    });
    
    $("#context-menu").show('fast');

    //-- elemento html que iniciou o contexmenu
    let clicked = $("#context-menu").attr('clickedId');

    loadClicked('#context-menu', clicked);
    changeClick('#context-menu',clicked);

    return false;
}

function changeClick(container, clicked){

    //CHANGE SELECT MULTIPLE
    $('#multiple').click(function(event){
        document.querySelector(`#${clicked}`).toggleAttribute('multiple');
        domHasChanged();
    });

    //CHANGE COL GRID
    $('#colGrid').change(function(event){
        let atual = findClass(container, 'col-md-');
        let nova = $('#colGrid').val()
        $(`#${clicked}`).toggleClass(`${atual} ${nova}`);
        domHasChanged();
    });
    //--CHANGE COL GRID LEFT/RIGHT/???CENTER??? *** 'text-right text-left text-center'
    $('#colAlign').click(function(event){
        $(`#${clicked}`).toggleClass('text-right');
        domHasChanged();
    });

    //CHANGE ID
    $('#elementId').change(function(event){     
        let newId = $('#elementId').val();
        $(container).attr('clickedId', newId);
        $(`#${clicked}`).attr('id', newId);  
        $(`#${newId}`).click();  
        domHasChanged();        
    });
    
    //--CHANGE LABEL
    $('#labelInput').change(function(event){
        if($(`#${clicked}`).text()){
            $(`#${clicked}`).text( $('#labelInput').val() );
        }
        if($(`#${clicked}`).parent().find('label').text()){
            $(`#${clicked}`).parent().find('label').text( $('#labelInput').val() );
        }
        domHasChanged();
    });
    //--CHANGE LABEL BOLD
    $('#bold').click(function(event){
        $(`#${clicked}`).toggleClass('font-weight-bold');
        domHasChanged();
    });

    //--PLACEHOLDER
    $('#placeholder').change(function(event){
        $(`#${clicked}`).attr('placeholder', $('#placeholder').val());
        domHasChanged();
    });

    //-- MARGIN CHANGE
    $('#mt').change(function(event){ 
        if(findClass(container, 'mt-')){           
            document.querySelector(`#${clicked}`).classList.remove(findClass(container, 'mt-'));
        }
        document.querySelector(`#${clicked}`).classList.add(`${'mt-'}${event.target.value}`); 
        domHasChanged();           
    });
    $('#mr').change(function(event){ 
        if(findClass(container,  'mr-')){           
            document.querySelector(`#${clicked}`).classList.remove(findClass(container, 'mr-'));
        }
        document.querySelector(`#${clicked}`).classList.add(`${'mr-'}${event.target.value}`); 
        domHasChanged();           
    });
    $('#mb').change(function(event){ 
        if(findClass(container,  'mb-')){           
            document.querySelector(`#${clicked}`).classList.remove(findClass(container, 'mb-'));
        }
        document.querySelector(`#${clicked}`).classList.add(`${'mb-'}${event.target.value}`);
        domHasChanged();            
    });
    $('#ml').change(function(event){ 
        if(findClass(container, 'ml-')){           
            document.querySelector(`#${clicked}`).classList.remove(findClass(container, 'ml-'));
        }
        document.querySelector(`#${clicked}`).classList.add(`${'ml-'}${event.target.value}`);
        domHasChanged();            
    });

    //--OUTLINE CHANGE
    $('#outline').click(function(event){
        $('input[name="colors"]:checked').click();
        domHasChanged();
    });

    //--COLOR CHANGE
    $('input[name="colors"]').click(function(event){
        let prefix = 'btn-';
        let find = 'btn-';        
        if($('#outline').prop('checked')==true){
            prefix = 'btn-outline-';
        }
        if(findClass(container, find)){
            document.querySelector(`#${clicked}`).classList.remove(findClass(container, find));
            document.querySelector(`#${clicked}`).classList.add(`${prefix}${event.target.id}`);
        }
        domHasChanged();
    });

    //-- CHANGE CHECKBOX/RADIO ORIENTATION
    $('#vertical').click(function(event){
        if($('#vertical').prop('checked')==true){
            let div = document.querySelector(`#${clicked}`).parentElement
            if(div.classList.contains('custom-control-inline')){
                div.classList.remove('custom-control-inline');
            }
        }
        domHasChanged();
    });
    $('#horizontal').click(function(event){
        let div = document.querySelector(`#${clicked}`).parentElement
        if($('#horizontal').prop('checked')==true){
            if(!div.classList.contains('custom-control-inline')){
                div.classList.add('custom-control-inline');
            }
        }
        domHasChanged();
    });

    //-- CHANGE TEXTAREA ROWS
    $('#txtRows').change(function(event){
        $(`#${clicked}`).attr('rows', $('#txtRows').val());
        domHasChanged();
    });
}

function changeColSize() {
    let clicked = $("#context-menu").attr('clickedId');
    $(`#${clicked}`).toggleClass('col-md-6 col-md-12');
    //domHasChanged();
}

function changeColAlign(){
    let clicked = $("#context-menu").attr('clickedId');
    $(`#${clicked}`).toggleClass('text-right text-left'); 
}

function loadClicked(container, clicked){
    //--CHECKBOX ORIENTATION  
    let div = document.querySelector(`#${clicked}`).parentElement; 
    if(div.classList.contains('custom-control-inline')){
        $('#horizontal').attr('checked', true);   
    }else{
        $('#vertical').attr('checked', true);
    }
    
    //--COL GRID
    $('#colGrid').val(findClass(container, 'col-md-'));

    //--COL GRID LEFT/RIGHT *** 'text-right text-left'
    if($(`#${clicked}`).hasClass('text-right')){
        $('#colAlign').attr('checked', true);
    }

    //--SELECT MULTIPLE
    if( document.querySelector(`#${clicked}`).hasAttribute('multiple') ){
        $('#multiple').attr('checked', true);
    }

    //--CARREGA ID
    $('#elementId').val($(`#${clicked}`).attr('id'));

    //--CARREGA PLACEHOLDER
    $('#placeholder').val($(`#${clicked}`).attr('placeholder'));

    //--CARREGA LABEL
    let label = $(`#${clicked}`).text() || $(`#${clicked}`).parent().find('label').text();
    $('#labelInput').val(label);
    
    //--CARREGA LABEL BOLD
    if(findClass(container, 'font-weight-bold')){
        $('#bold').attr('checked', true);
    }

    //CARREGA MARGIN
    if(findClass(container, 'mt-')){ 
        $('#mt').val(findClass(container, 'mt-').replace('mt-', ''));
    }
    if(findClass(container, 'mr-')){ 
        $('#mr').val(findClass(container, 'mr-').replace('mr-', ''));
    }
    if(findClass(container, 'mb-')){ 
        $('#mb').val(findClass(container, 'mb-').replace('mb-', ''));
    }
    if(findClass(container, 'ml-')){ 
        $('#ml').val(findClass(container, 'ml-').replace('ml-', ''));
    }

    //--CARREGA OUTLINE
    if(findClass(container, 'btn-outline-')){
        $('#outline').attr('checked', true);
    }

    //-- CARREGA BTN COLOR   
    let btnClassId = '';
    let isBtn = findClass(container, 'btn-')
    if(isBtn){
        btnClassId = isBtn.replace('btn-', '').replace('outline-', '');
        $(`#${btnClassId}`).attr('checked', true);
    }

    //-- CARREGA TEXTAREA ROWS
    $('#txtRows').val($(`#${clicked}`).attr('rows'));
}

function findClass(container, partial){
    let clicked = $(container).attr('clickedId');
    let obj = document.querySelector(`#${clicked}`);
    let ret = "";

    for(let i=0; i<obj.classList.length; i++){
        if(obj.classList.item(i).indexOf(partial)>=0){
            ret = obj.classList.item(i);
        }
    }
    return ret;
}