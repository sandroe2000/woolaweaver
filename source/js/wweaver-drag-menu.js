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

function replaceIcoMenu(el) {

    var title = el.getAttribute("data-original-title");
    var code = el.getAttribute("data-code");
    var replacedEl;
    var isColumn = false;
    var isContainer = false;

    switch (title) {
        case 'Label':
            replacedEl = getLabel();
            break;
        case 'Input Text':
            replacedEl = getInput('text');
            break;
        case 'Input Password':
            replacedEl = getInput('password');
            break;
        case 'Column':
            isColumn = true;
            isContainer = true;
            replacedEl = getColumn();
            break;
        case 'Row':
            isContainer = true;
            replacedEl = getRow();
            break;
        case 'Textarea':
            replacedEl = getTextarea();
            break;
        case 'Snippet':
            replacedEl = getSideMenuSnippet(code);
            break;
        default:
            return false;
    }

    //PONTO DE ATENÇÃO - AS VEZES NÃO FAZ APPENDCHILD
    if(!el.parentNode) {
        console.log("Drop error: "+el.innerHTML+", el.parentNode: null");
        return;
    }
    el.parentNode.appendChild(replacedEl);
    replacedEl.parentNode.removeChild(el);

    //TODO - RESPONSABILIDADE DE "isColumn" PARA UMA FUNÇÃO RECURSIVA
    if (isColumn) {
        replacedEl.addEventListener('click', initResize, false);
    }

    //TODO - RESPONSABILIDADE DE "isContainer" PARA UMA FUNÇÃO RECURSIVA
    if (isContainer) {
        pushContainer(replacedEl);
    }

    if(replacedEl.classList && !replacedEl.classList.contains('row')){
        if(!replacedEl.previousSibling || (replacedEl.previousSibling && replacedEl.previousSibling.data!='\n')){
            replacedEl.parentNode.insertBefore(document.createTextNode('\n'), replacedEl);
        }
    }

    replacedEl.parentNode.appendChild(document.createTextNode('\n'));
}

function dragFromMenu() {

    drake = dragula({
        copy: function(el, source) {
            return dragIsCopy(el);
        },
        accepts: function(el, target) {
            return dragIsAcceptable(el, target);
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
        replaceIcoMenu(el);
    });

    pushContainer(document.querySelector('.sub-menu'));
    pushContainer(document.querySelector('.edit'));
    pushContainer(document.querySelector('.row'));
    pushContainer(document.querySelector('.snippets'));

}

function dragIsCopy(el){
    if (el.classList.contains('action-btn')) return true;
    if (el.classList.contains('snippet-item')) return true;
    return false;
}

function dragIsAcceptable(el, target){
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
