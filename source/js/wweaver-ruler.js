'use strict'

var containerSize = document.querySelector('#mainContainer').offsetWidth;
var grid = [8.33, 16.66, 25, 33.33, 41.66, 50, 58.33, 66.66, 75, 83.33, 91.66, 100];

function setRuler() {
    var ruler = document.querySelector('#ruler');
    var divRulerCol = document.createElement("div");
    var spanSeparador = document.createElement("span");
    var separador = document.createTextNode("|");

    spanSeparador.appendChild(separador);
    divRulerCol.classList.add("ruler-col");
    divRulerCol.appendChild(spanSeparador);

    for (var i = 1; i <= 12; i++) {
        var contador = document.createTextNode(i);
        var newDivrulerCol = divRulerCol.cloneNode(true);
        newDivrulerCol.appendChild(contador);
        ruler.appendChild(newDivrulerCol);
    }
}