'use strict';

var drake;
var id = 1;

function getId(){
    return id++;
}

function menuTooltip() {

    var elementsTooltip = document.querySelectorAll('[data-toggle="tooltip"]');

    for (var i = 0; i < elementsTooltip.length; i++) {
        new Tooltip(elementsTooltip[i], {
            placement: 'top'
        })
    }
}

function getRow() {
    var row = document.createElement("div");
    row.setAttribute("id", "row"+getId());
    row.classList.add("row");
    return row;
}

function getColumn() {
    var column = document.createElement("div");
    column.setAttribute("id", "col"+getId());
    column.classList.add("col-md-2");
    column.classList.add("col");
    return column;
}

function getLabel() {
    var label = document.createElement("label");
        label.setAttribute("id", "lbl"+getId());
        label.setAttribute("contenteditable", true);
    var text = document.createTextNode("Label:");
    label.appendChild(text);
    return label;
}

function getInput(type) {
    var input = document.createElement("Input");
    input.setAttribute("id", "inp"+getId());
    input.setAttribute("type", type);
    input.classList.add("form-control");
    return input;
}

function getTextarea() {
    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", "txt"+getId());
    textarea.classList.add("form-control");
    return textarea;
}

function getSideMenuSnippet(code){
    //TODO - RECUPERAR SNIPPET DO DB
    var snippet = window.atob(code);///DECODE BASE 64
    return snippet.toDomElement();
}

function setElementDrag(el) {

    var title = el.getAttribute("data-original-title");
    var code = el.getAttribute("data-code");
    var node;

    switch (title) {
        case 'Label':
            node = getLabel();
            break;
        case 'Input Text':
            node = getInput('text');
            break;
        case 'Input Password':
            node = getInput('password');
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
        case 'Snippet':
            node = getSideMenuSnippet(code);
            break;
        default:
            return false;
    }

    //PONTO DE ATENÇÃO - AS VEZES NÃO FAZ APPENDCHILD
    if(!el.parentNode) {
        console.log("Drop error: "+el.innerHTML+", el.parentNode: null");
        return;
    }
    el.parentNode.appendChild(node);
    node.parentNode.removeChild(el);

    listDOM(node, setEventToDOM);

    if(node.classList && !node.classList.contains('row')){
        if(!node.previousSibling || (node.previousSibling && node.previousSibling.data!='\n')){
            node.parentNode.insertBefore(document.createTextNode('\n'), node);
        }
    }

    node.parentNode.appendChild(document.createTextNode('\n'));
}

function isLabel(event){
    event.stopPropagation();
    this.focus();
}

function dragFromMenu() {

    drake = dragula({
        copy: function(el, source) {
            return isCopy(el);
        },
        accepts: function(el, target) {
            return isAcceptable(el, target);
        },
        removeOnSpill: true
    }).on('over', function (el, container, source) {
        if(container != source){
            container.classList.toggle("drag-over");
        }
    }).on('out', function (el, container, source) {
        container.classList.remove("drag-over");
    }).on('drop', function(el, container) {
        container.classList.remove('draging');
        setElementDrag(el);
    });

    pushContainer(document.querySelector('.sub-menu'));
    pushContainer(document.querySelector('.edit'));
    pushContainer(document.querySelector('.row'));
    pushContainer(document.querySelector('.snippets'));

}

function isCopy(el){
    if (el.classList.contains('action-btn')) return true;
    if (el.classList.contains('snippet-item')) return true;
    return false;
}

function isAcceptable(el, target){
    if (target.classList.contains('edit')) {
        if(el.getAttribute("data-original-title")=="Row"){
            return true;
        }
        if(el.getAttribute("data-original-title")=="Snippet"){
            return true;
        }
    }
    if (target.classList.contains('row')) {
        if(el.getAttribute("data-original-title")=="Column"){
            return true;
        }
    }
    if (target.classList.contains('col')) return true;
    return false;
}

function pushContainer(el) {
    drake.containers.push(el);
}