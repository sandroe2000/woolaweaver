'use strict'

var startX, startY, startWidth, startHeight, el;
var containerSize = document.querySelector('#mainContainer').offsetWidth;

function initResize() {
    el = this;
    if(!el.classList.contains('col')) return;
    el.classList.add('resizable');
    var resizer = document.createElement('div');
    resizer.classList.add('resizer');
    el.appendChild(resizer);
    resizer.addEventListener('mousedown', initResizeDrag, false);
}

function initResizeDrag(e) {
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
    document.documentElement.addEventListener('mousemove', doResizeDrag, false);
    document.documentElement.addEventListener('mouseup', stopResizeDrag, false);
}

function doResizeDrag(e) {
    el.style.width = (startWidth + e.clientX - startX) + 'px';
}

function stopResizeDrag(e) {

    document.documentElement.removeEventListener('mousemove', doResizeDrag, false);
    document.documentElement.removeEventListener('mouseup', stopResizeDrag, false);
    var dragSize = getResizeDragWidth(e.clientX, getPosition(el));
    var celSize = getBootstrapColSize(dragSize);
    clearColAfterResize();
    el.classList.add(celSize);
}

function getResizeDragWidth(dragSize, xPosition) {

    dragSize = (dragSize - xPosition);

    if (dragSize > containerSize) return containerSize;
    return (dragSize);
}

function getBootstrapColSize(dragSize) {
    var colPercent = (100 * dragSize) / containerSize;
    for (var i = 0; i < grid.length; i++) {
        if (colPercent <= grid[i]) return "col-md-" + (i + 1);
        if (colPercent >= grid[i] && colPercent <= getMiddleCol(i)) return "col-md-" + (i + 1);
    }
}

function getMiddleCol(i) {
    if (i == grid.length) return grid[i];
    return grid[i] + ((grid[(i + 1)] - grid[i]) / 2);
}

function clearColAfterResize() {
    el.removeAttribute("style");
    el.removeChild(getChildenByClass(el, 'resizer'));
    el.classList.remove('resizable');
    startX=null;
    startY=null;
    startWidth=null;
    startHeight=null;
    for (var i = 1; i <= 12; i++) {
        el.classList.remove("col-md-" + i);
    }
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