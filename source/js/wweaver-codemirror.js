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

    removeAttributeSelecorAll( document.querySelectorAll(".col") );

    if (!main.classList.contains("hide")) {

        var cmBody = document.createElement("div");
            cmBody.setAttribute("id", "0001");
            cmBody.innerHTML = editor.getValue();

        listDOM( cmBody.childNodes[0], printLog );
    } else {

        listDOM(main, printLog);

        editor.setValue(main.innerHTML);
        for (var i = 0; i < editor.lineCount(); i++) {
            editor.indentLine(i);
        }
    }
}

function listDOM (node, func) {
    func(node); // Will be called on every DOM element
    node = node.firstChild;
    while(node) {
        listDOM(node, func);
        node = node.nextSibling;
    }
}

function printLog(node){
    var tag = "";
    var id="";
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

        if(node.textContent.trim() == '\n'){
            return;
        }else{
            txt = node.textContent;
        }
    }
    console.log( tag +" | "+ id +" | "+ clss+" | "+ txt );

}
