function addListenerSelecorAll(elements, action, func) {
    [].forEach.call(
        elements,
        function(el) {
            el.addEventListener(action, func, false);
        }
    );
}

function removeListenerSelecorAll(elements, action, func) {
    [].forEach.call(
        elements,
        function(el) {
            el.removeEventListener(action, func);
        }
    );
}

function getChildenByClass(baseElement, wantedElementClass) {
    var elementToReturn;
    for (var i = 0; i < baseElement.childNodes.length; i++) {
        elementToReturn = baseElement.childNodes[i];
        if (elementToReturn.getAttribute("class") == wantedElementClass) {
            return elementToReturn;
        }
    }
    return null;
}

function removeAttributeSelecorAll(elements) {
    [].forEach.call(
        elements,
        function(el) {
            el.removeAttribute("style");
        }
    );
}

String.prototype.toDomElement = function () {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = this;
    return wrapper.childNodes[0];
};