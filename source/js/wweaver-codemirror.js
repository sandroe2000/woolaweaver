var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	mode: {name: "htmlmixed'", globalVars: true}
});

editor.setSize('100%', document.querySelector("main").offsetHeight);

function toggleCodeMirror(){

	var main = document.querySelector("#mainContainer");
	var code = document.querySelector("#codeContainer");

	main.classList.toggle("hide");
	code.classList.toggle("show");

	document.querySelector("[style]").removeAttribute("style")
	
	if(!main.classList.contains("hide")){

		//main.innerHTML = editor.getValue();
	}else{

		editor.setValue(main.innerHTML);
		editor.refresh();
	}
}
