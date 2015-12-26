'use strict';

var editor = CodeMirror.fromTextArea(
	document.getElementById("code"),
	{
		lineNumbers: true,
		lineWrapping: true,
		mode: "htmlmixed"
	}
);

editor.setSize('100%', document.querySelector("main").offsetHeight);
editor.refresh();

function toggleEditor() {
    var main = document.querySelector("#mainContainer");
    var code = document.querySelector("#codeContainer");
    main.classList.toggle("hide");
    code.classList.toggle("show");
    removeAttributeSelecorAll( document.querySelectorAll(".col"), "style" );
    if (!main.classList.contains("hide")) {
        var editorBody = document.createElement("div");
            editorBody.setAttribute("id", "0001");
            editorBody.innerHTML = editor.getValue();
        main.innerHTML = editor.getValue();
        listDOM(main, setEventToDOM);
        //console.log(total_cols);
    } else {
        editor.setValue(main.innerHTML);
        for (var i = 0; i < editor.lineCount(); i++) {
            editor.indentLine(i);
        }
    }
}

function listDOM (node, func) {
    func(node); 
    node = node.firstChild;
    while(node) {
        listDOM(node, func);
        node = node.nextSibling;
    }
}

function setEventToDOM(node){
    setRowEvent(node);
    setColEvent(node);
    setLabelEvent(node); 
}

function setRowEvent(node){
    if(node.hasAttribute && node.classList.contains("row")){
        pushContainer(node);
        return;
    }
}

function setColEvent(node){
    if(node.hasAttribute && node.classList.contains("col")){
        node.addEventListener('click', initResize, false);
        pushContainer(node);
        return;
    }
}

function setLabelEvent(node){
    if(node.tagName && node.tagName=='LABEL'){
        node.addEventListener('click', isLabel, false);
        return;
    }
}

function printLog(node){
    var tag = "";
    var id = "";
    var clss = "";
    var txt = "";

    if(node.tagName){
        tag = node.tagName;
    }
    if(node.hasAttribute && node.hasAttribute("id")){
        id = node.getAttribute("id")
    }
    if(node.hasAttribute && node.hasAttribute("class")){
        clss = node.getAttribute("class")
    }
    if(node.nodeType === Node.TEXT_NODE){

        if(node.textContent.indexOf('\n') >= 0){
            return;
        }else{
            txt = node.textContent;
        }
    }
    console.log( tag +" | "+ id +" | "+ clss+" | "+ txt );
}
