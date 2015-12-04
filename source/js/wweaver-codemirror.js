var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	extraKeys: {"Ctrl-Space": "autocomplete"},
	mode: {name: "javascript", globalVars: true}
});

editor.setSize('100%', document.querySelector("main").offsetHeight);

function toggleCodeMirror(){

	var main = document.querySelector("#mainContainer");
	var code = document.querySelector("#codeContainer");

	main.classList.toggle("hide");
	code.classList.toggle("show");
	
	if(!main.classList.contains("hide")){

		console.log(editor.getValue());
		main.innerHTML = editor.getValue();
	}else{

		editor.setValue(main.innerHTML);
		editor.refresh();
	}
}
