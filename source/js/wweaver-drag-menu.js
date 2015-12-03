'use strict'

var drake;

function menuTooltip() {

    var elementsTooltip = document.querySelectorAll('[data-toggle="tooltip"]');

    for (var i = 0; i < elementsTooltip.length; i++) {
        new Tooltip(elementsTooltip[i], {
            placement: 'bottom'
        })
    }
}

function getRow() {
    var row = document.createElement("div");
    row.setAttribute("id", "row0008");
    row.classList.add("row");
    return row;
}

function getColumn() {
    var column = document.createElement("div");
    column.setAttribute("id", "col0007");
    column.classList.add("col-md-2");
    column.classList.add("col");
    return column;
}

function getLabel() {
    var label = document.createElement("label");
    var text = document.createTextNode("Label:");
    label.appendChild(text);
    return label;
}

function getInput(type) {
    var input = document.createElement("Input");
    input.setAttribute("type", type);
    input.classList.add("form-control");
    return input;
}

function getTextarea() {
    var textarea = document.createElement("textarea");
    textarea.setAttribute("id", "txt0009");
    textarea.classList.add("form-control");
    return textarea;
}

function replaceIcoMenu(el) {

    var title = el.getAttribute("data-original-title");
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
        default:
            return false;
    }

    el.parentNode.appendChild(replacedEl);
    el.parentNode.removeChild(el);

    if (isColumn) {
        replacedEl.addEventListener('click', initResize, false);
    }

    if (isContainer) {
        pushContainer(replacedEl);
    }
}

function dragFromMenu() {

    drake = dragula({
        copy: function(el, source) {
            return el.classList.contains('action-btn');
        },
        accepts: function(el, target) {
            if (target.classList.contains('edit')) return true;
            if (target.classList.contains('row')) return true;
            if (target.classList.contains('col')) return true;
            return false;
        },
        removeOnSpill: true
    }).on('drop', function(el, container) {
        container.classList.remove('draging');
        replaceIcoMenu(el);
    });

    pushContainer(document.querySelector('.sub-menu'));
    pushContainer(document.querySelector('.edit'));
    pushContainer(document.querySelector('.row'));

}

function pushContainer(el) {
    drake.containers.push(el);
}

function getPosition(el) {
    var xPosition = 0;
    var yPosition = 0;

    while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }
    return xPosition;
}
