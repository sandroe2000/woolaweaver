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

        //main.innerHTML = editor.getValue();
    } else {
        editor.setValue(main.innerHTML);
        for (var i = 0; i < editor.lineCount(); i++) {
            editor.indentLine(i);
        }
    }
}
