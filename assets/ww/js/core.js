;
'use strict';

let drakeMenu;
let contId = 0;
let ruler = document.querySelector('.main-ruler.container-fluid').childNodes[1];
let footerBreadcrumb = document.querySelector('div.main-footer > ol.breadcrumb');
let currentNodeInEdit = null;
let currentCopyedNode = null;
let maxLen = 100;
let currentContentNode = 0;

window.addEventListener('keydown', function(event) {
    if (event.keyCode == 46) { 
        if(event.target.classList.contains('edit')){
            return false;
        }        
        if(!$('div.main-editor').hasClass('hide')){
            return false;
        }
        if(!$(event.target).parents('div.main-content').length){
            return false;
        }
        confirmDelete({
            msg:"Deseja realmente exluir este item?",
            callback: removeNode
        });
    }
    if (event.ctrlKey && event.keyCode == 90) { undoRedo('UNDO'); }
    if (event.ctrlKey && event.keyCode == 89) { undoRedo('REDO'); }
    if (event.ctrlKey && event.keyCode == 67) { copySelectdNode(); }
    if (event.ctrlKey && event.keyCode == 86) { pastSelectdNode(); }
    if (event.ctrlKey && event.keyCode == 88) { cuteSelectdNode(); }
}, false);

function setRuler(){
    let totalCols = 12;
    for (let i = 0; i < totalCols; i++) {
        let colRule = document.createElement('div');
        colRule.setAttribute('class', 'col-md-1');
        colRule.appendChild(document.createTextNode(i + 1));
        ruler.appendChild(colRule);
    }
}

function getId(prefix){
    return `${prefix}${Date.now()}`;
}

function getRow() {
    return `<div id="${getId('row')}" class="row"></div>`;
}

function getColumn() {
    return `<div id="${getId('col')}" class="col-md-6"></div>`;
}

function getLabel() {
    return `<label id="${getId('lbl')}">Label</label>`;
}

function getInput(type) {

    if (type == 'radio') {
        return  `<div class="form-check">
                    <input id="${getId('ipn')}" type="radio" class="form-check-input" />
                    <label id="${getId('lbl')}" class="form-check-label">Label</label>
                </div>`;
    }

    if (type == 'checkbox') {
        return `<div class="custom-control custom-switch">
                    <input id="${getId('ipn')}" type="checkbox" class="custom-control-input" />
                    <label id="${getId('lbl')}" class="custom-control-label">Label</label>
                </div>`;
    }

    return `<input id="${getId('inp')}" type="${type}" class="form-control" />`;
}

function getSideMenuSnippet(code) {
    //TODO - RECUPERAR SNIPPET DO DB
    var snippet = window.atob(code); ///DECODE BASE 64
    return snippet.toDomElement();
}

function getSelect() {
    return `<select id="${getId('sel')}" class="form-control">
                <option>Selecione uma opção</option>
            </select>`;
}

function getTextarea(){
    return `<textarea id="${getId('txt')}" class="form-control" rows="3"></textarea>`;
}

function getButton(){
    return `<button id="${getId('btn')}" type="button" class="btn btn-light">Light</button>`;
}

function setElementDrag(el) {

    let title = el.getAttribute("title");
    let code = el.getAttribute("data-code");
    let node;

    switch (title) {
        case 'Label':
            node = getLabel();
            break;
        case 'Input Text':
            node = getInput('text');
            break;
        case 'Input Email':
            node = getInput('email');
            break;
        case 'Input Password':
            node = getInput('password');
            break;
        case 'Input Date':
            node = getInput('date');
            break;
        case 'Input Number':
            node = getInput('number');
            break;
        case 'Input Checkbox':
            node = getInput('checkbox');
            break;
        case 'Input Radio':
            node = getInput('radio');
            break;
        case 'Column':
            node = getColumn();
            break;
        case 'Row':
            node = getRow();
            break;
        case 'Textarea':
            node = getTextarea();
            break;
        case 'Select':
            node = getSelect();
            break;
        case 'Button':
            node = getButton();
            break;
        case 'Snippet':
            node = getSideMenuSnippet(code);
            break;
        default:
            return false;
    }

    if (el.parentNode) {
        node = node.toDomElement();
        el.parentNode.replaceChild(node, el);
        listDOM(node, setEventToDOM);
        domHasChanged(node);
    }
}

function dragFromMenu() {

    drakeMenu = dragula({
        copy: function(el, source) {
            return isCopy(el);
        },
        accepts: function(el, target) {
            return isAcceptable(el, target);
        }
    }).on('drop', function(el, container) {
        setElementDrag(el);
    });

    //START DRAG HERE
    pushContainer(document.querySelector('.sideBarForm'));
    pushContainer(document.querySelector('.sideBarLayout'));
    pushContainer(document.querySelector('.sideBarComponents'));
    pushContainer(document.querySelector('.edit'));

    document.querySelector('.main-content.container-fluid.edit').addEventListener('click', setBreadcrumb, false);
}

function isCopy(el) {
    if (el.classList.contains('btn-aside-menu')) return true;
    if (el.classList.contains('snippet-item')) return true;
    return false;
}

function isAcceptable(el, target) {
    if(el.disabled){
        return false;
    }
    if (target.classList.contains('edit')) {
        if (el.getAttribute("title") == "Row"){ return true; }
    }
    if (target.classList.contains('row')) {
        if (el.getAttribute("title") == "Column"){ return true; }
    }
    //if (target.classList.contains('col-md-6') || target.classList.contains('col-md-12')) {
    if(target.hasAttribute && target.getAttribute("id") && findInObj(target.getAttribute("id"), 'col-md-')){
        if (el.getAttribute("title") == "Row"){ return true; }
        if (el.getAttribute("title") == "Label"){ return true; }
        if (el.getAttribute("title") == "Input Text"){ return true; }
        if (el.getAttribute("title") == "Input Email"){ return true; }
        if (el.getAttribute("title") == "Input Password"){ return true; }
        if (el.getAttribute("title") == "Input Number"){ return true; }
        if (el.getAttribute("title") == "Input Checkbox"){ return true; }
        if (el.getAttribute("title") == "Input Radio"){ return true; }
        if (el.getAttribute("title") == "Textarea"){ return true; }
        if (el.getAttribute("title") == "Select"){ return true; }
        if (el.getAttribute("title") == "Button"){ return true; }
    }
    return false;
}

function findInObj(id, clazz){
    //debugger;
    let el = document.querySelector(`#${id}`);
    let ret = '';

    for(let i=0; i<el.classList.length; i++){
        if(el.classList.item(i).indexOf(clazz)>=0){
            ret = el.classList.item(i);
        }
    }
    return ret;
}

function cuteSelectdNode() {
    if (!isCopyAcceptable()) return false;
    var template = document.createElement('div');
    template.innerHTML = currentNodeInEdit.outerHTML.replace('actived', '');
    listDOM(template, replaceNodeId);
    currentCopyedNode = template.firstChild;
    $('.actived').remove();
    domHasChanged();
    setSnakBar('Cuted!');
}

function copySelectdNode() {
    if (!isCopyAcceptable()) return false;
    var template = document.createElement('div');
    template.innerHTML = currentNodeInEdit.outerHTML.replace('actived', '');
    listDOM(template, replaceNodeId);
    currentCopyedNode = template.firstChild;
    setSnakBar('Copied!');
}

function isCopyAcceptable() {
    let mainContent = document.querySelector('.main-content.container-fluid.edit');
    if (!currentNodeInEdit) return false;
    if (currentNodeInEdit == mainContent) return false;
    return true;
}

function pastSelectdNode() {
    if (!isPastAcceptable()) return false;
    currentNodeInEdit.appendChild(currentCopyedNode);
    listDOM(currentCopyedNode, setEventToDOM);
    domHasChanged();
}

function loadContentNode(content) {
    let mainContent = document.querySelector('.main-content');
    let div = document.createElement('div');
        div.appendChild(content);
    let node = div.firstChild;
    
    mainContent.parentNode.replaceChild(node, mainContent);
    pushContainer(document.querySelector('.edit'));
    listDOM(node, setEventToDOM);
    setContextmenu();
    domHasChanged();
}

function isPastAcceptable() {
    if (!currentCopyedNode || !currentNodeInEdit) return false;
    if (currentCopyedNode == currentNodeInEdit) return false;
    if (currentNodeInEdit.classList.contains('edit') && !currentCopyedNode.classList.contains('row')) return false;
    //if (currentNodeInEdit.classList.contains('row') && (!currentCopyedNode.classList.contains('col-md-6') && !currentCopyedNode.classList.contains('col-md-12') )) return false;
    if (currentNodeInEdit.classList.contains('row') && !findInClass(currentCopyedNode.getAttribute("class"), 'col-md-') ) return false;
    return true;
}

function findInClass(clazz, partial){
    if(clazz.indexOf(partial) < 0) return false;
    return true;
}

function replaceNodeId(node) {

    if (!node.hasAttribute || !node.hasAttribute('id')) return false;

    var prefixId = "";
    var id = node.getAttribute('id');
    if (id.indexOf('row') > -1) prefixId = 'row';
    if (id.indexOf('col') > -1) prefixId = 'col';
    if (id.indexOf('lbl') > -1) prefixId = 'lbl';
    if (id.indexOf('inp') > -1) prefixId = 'inp';
    if (id.indexOf('txt') > -1) prefixId = 'txt';
    if (id.indexOf('sel') > -1) prefixId = 'sel';
    if (id.indexOf('btn') > -1) prefixId = 'btn';
    //TODO - OUTROS ID.....

    node.setAttribute('id', getId(prefixId));
}

function pushContainer(el) {
    drakeMenu.containers.push(el);
}

String.prototype.toDomElement = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = this;
    return wrapper.firstElementChild;
};

function setEventToDOM(node){
    setEventsRow(node);
    setEventsCol(node);
    setEventsInput(node);
}

function setEventsCol(node) { 
    if (node.hasAttribute && (node.classList.contains("col-md-6") || node.classList.contains("col-md-12")) ){     
        drakeMenu.containers.push(node);
        //setContextmenu(node);        
    }
}

function setEventsInput(node) { 
    if (node.hasAttribute && (node.classList.contains("form-control") || node.classList.contains("custom-control-input")) ){     
        //setContextmenu(node);        
    }
}

function setEventsRow(node) {    

    if (node.hasAttribute && node.classList.contains("row")) { 
        drakeMenu.containers.push(node);             
        return;
    }
}

function setBreadcrumb(event) {

    let mainContent = document.querySelector('.main-content.container-fluid.edit');
    cleanBreadcrumb();
    listDOM(document.querySelector('.main-content.container-fluid.edit'), removeClicked);
    addBreadcrumb(event.target);
    event.target.classList.add('actived');
    event.target.focus();
    currentNodeInEdit = event.target;
}

function cleanBreadcrumb() {
    footerBreadcrumb.innerHTML = "";
}

function addBreadcrumb(node) {

    if (!node) return false;
    var el = node;
    var clicked = node;
    let mainContent = document.querySelector('.main-content.container-fluid.edit');

    while (el.parentNode) {
        var li = document.createElement('li');
            li.setAttribute('class', 'breadcrumb-item');
        var a = document.createElement('a');
        a.setAttribute('href', 'javascript:void(0);');
        a.setAttribute('onclick', 'clickOnBreadcrumb(this)');
        var txt = el.nodeName.toLowerCase();
        if (el.getAttribute('id')) txt += "#" + el.getAttribute('id');
        if (el.getAttribute('class')) {
            var cls = el.getAttribute('class').split(' ');
            for (var i = 0; i < cls.length; i++) {
                if (cls[i] !== 'actived') txt += "." + cls[i];
            }
        }
        var txtNode = document.createTextNode(txt);
        a.appendChild(txtNode);
        li.appendChild(a);
        if (el === mainContent) return false;
        footerBreadcrumb.insertBefore(li, footerBreadcrumb.childNodes[0]);
        el = el.parentNode;
    }
}

function clickOnBreadcrumb(el) {
    let node = document.querySelector(el.lastChild.textContent);
    node.click();
}

function removeClicked(node) {
    if (node.hasAttribute && node.classList.contains('actived')) {
        node.classList.remove('actived');
    }
    if (node.hasAttribute && node.classList.contains('node-selected')) {
        node.classList.remove('node-selected');
    }
}

function listDOM(node, func) {

    document.querySelector('.main-content.container-fluid.edit.block').removeEventListener('click', setBreadcrumb, false);
    document.querySelector('.main-content.container-fluid.edit.block').addEventListener('click', setBreadcrumb, false);

    func(node);
    node = node.firstChild;
    while (node) {
        listDOM(node, func);
        node = node.nextSibling;
    }
}

function undoRedo(action) {

    let versionContentNode = getVersionContentNode();
    let i;
    let mainContent = document.querySelector('.main-content.container-fluid.edit');

    if (currentContentNode < 0) return false;

    i = currentContentNode;
    if (action == 'UNDO') i++;
    if (action == 'REDO') i--;

    if (!versionContentNode || i > versionContentNode.length) return false;
    if (!versionContentNode[i]) return false

    var template = document.createElement('div');
    template.innerHTML = versionContentNode[i];
    var nodes = template.firstChild;

    mainContent.parentNode.replaceChild(nodes, mainContent);

    currentContentNode = i;
    
    drakeMenu.containers.length  = 0;

    pushContainer(document.querySelector('.sideBarForm'));
    pushContainer(document.querySelector('.sideBarLayout'));
    pushContainer(document.querySelector('.sideBarComponents'));
    pushContainer(document.querySelector('.edit'));
    
    listDOM(document.querySelector('.main-content.container-fluid.edit'), setEventToDOM);
    setContextmenu();
}

function confirmDelete(options){
    
    $.confirm({
        title: 'Confirmação!',
        content: options.msg,
        draggable: true,
        closeIcon: true,
        buttons: {
            confirm: {
                keys: ['enter'],
                text: 'Ok',
                btnClass: 'btn-blue',
                action: options.callback
            },
            cancel: {
                keys: ['esc'],
                text: 'Cancel',
                btnClass: 'btn-warning',
                action: function () {
                    //close
                }
            }
        }       
    });
}

function removeNode(){
    $('.actived').remove();
    domHasChanged();
}

$('#chkRowBorders').change(function(event){
    $('div.main-content.container-fluid.edit div.row').toggleClass('showBorder');
});

$('#chkColBorders').change(function(event){
    $('div.main-content.container-fluid.edit [class*="col-md-"]').toggleClass('showBorder');
});

$('#chkGridSpace').change(function(event){
    $('div.main-content.container-fluid.edit [class*="col-md-"]').toggleClass('grid-space');
    $('div.main-content.container-fluid.edit div.row').toggleClass('grid-space');
});

function domHasChanged(){

    if($('#chkRowBorders').prop('checked')){
        $('div.main-content.container-fluid.edit div.row').removeClass('showBorder');
        $('div.main-content.container-fluid.edit div.row').addClass('showBorder');
    }

    if($('#chkColBorders').prop('checked')){
        $('div.main-content.container-fluid.edit [class*="col-md-"]').removeClass('showBorder');
        $('div.main-content.container-fluid.edit [class*="col-md-"]').addClass('showBorder');
    }

    setVersionContentNode();
    //if (currentNodeInEdit) currentNodeInEdit.click();
}

$('#btnCleanClipboardHistory').click(function(event){
    let options = {
        msg: "Deseja realmente limpar o histórico da área de transferência?",
        callback: cleanVersionContentNode
    };
    confirmDelete(options);    
});

function cleanVersionContentNode() {
    localStorage.setItem("versionContentNode", "");
}

function setVersionContentNode() {
    
    let mainContent = document.querySelector('.main-content.container-fluid.edit');

    if (typeof(Storage) == "undefined") return false;

    var versionContentNode = [];

    if (getVersionContentNode()) {
        versionContentNode = getVersionContentNode();
    }

    var clone = mainContent.cloneNode(true);

    //NÃO GRAVA CONTEÚDO IGUAL AO ÚLTIMO NÓ
    if(versionContentNode[0]==clone.outerHTML.replace('actived', '').replace(/\n/g, '')) return false;

    if (versionContentNode.length == 0) {
        versionContentNode.unshift('<div class="main-content container-fluid edit "></div>');
    }

    if (versionContentNode.length < maxLen) {
        versionContentNode.unshift(clone.outerHTML.replace('actived', '').replace(/\n/g, ''));
    } else {
        versionContentNode.pop();
        versionContentNode.unshift(clone.outerHTML.replace('actived', '').replace(/\n/g, ''));
    }

    localStorage.setItem("versionContentNode", JSON.stringify(versionContentNode));
}

function getConfirmRemoveMessage() {
    return localStorage.getItem("confirmRemoveMessage");
}

function getVersionContentNode() {
    if (localStorage.getItem("versionContentNode")) {
        return JSON.parse(localStorage.getItem("versionContentNode"));
    }
    return null;
}

function setSnakBar(msg) {
    let snackbar = document.querySelector("#snackbar");
    snackbar.innerHTML = msg;
    snackbar.classList.toggle("show");
    setTimeout(function() {
        snackbar.classList.toggle("show");
    }, 2000);
}

function getData(url){
    return fetch(url).then(function(response) {
        return response.text();
    }).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
}

(function() {
    dragFromMenu();
    setRuler();
    setContextmenu();
})();

