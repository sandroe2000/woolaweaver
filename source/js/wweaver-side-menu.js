'use strict';

var aside = document.querySelector('aside');
var nav = document.querySelector('nav');
var main = document.querySelector('main');
var sideMenu = document.querySelector('.side-menu i');
sideMenu.addEventListener('click', toggleSideMenu, false);

function toggleSideMenu() {

    //TODO - UTILIZAR CSS PSEUDO-CLASS E "classList.toggle('PSEUDO-CLASS')"
    if (aside.offsetLeft == -160) {
        aside.style.left = "0px";

        main.style.left = "190px";
        nav.style.left = "190px";
    } else {
        aside.style.left = "-160px";
        main.style.left = "30px";
        nav.style.left = "30px";
    }
}

function getSnippetModal(){

	var myModal = document.querySelector('#myModal');
	var snippetModal = new Modal( myModal );

	return snippetModal;
}

function setSnippet(description, code, icon){

	var list = document.querySelector('.snippets');
	var newSnippet = document.createElement("li");
		newSnippet.classList.add("snippet-item");
		newSnippet.setAttribute("data-original-title", "Snippet");
		newSnippet.setAttribute("data-code", window.btoa(code)); //ENCODE BASE 64

		newSnippet.setAttribute("id", "snp"+getId());

	var faIcon = document.createElement("i");
		faIcon.classList.add("fa");
		faIcon.classList.add(icon);

	newSnippet.appendChild( faIcon );
	newSnippet.appendChild( document.createTextNode(description) );
	//TODO - CODE REPRESENTATION
	list.appendChild(newSnippet);
}

function addSnippet(){

	var description = document.querySelector('#snpDescription').value;
	var icon = document.querySelector('#snpIcon').value;
	var code = document.querySelector('#snpCode').value;
	
	var snippetModal = getSnippetModal();
	
	setSnippet(description, code, icon);
	snippetModal.close();
}

function loadSnippets(){

	$.ajax({
    	url: "http://localhost:1111/snippet/",
   		method: "GET",
   		crossDomain: true,
   		datatype: 'application/json',	                 
        success: function(ajax) {
            $.each(ajax, function(index, item){
                setSnippet(
                	item.description,                 	 
                	item.icon,
                	item.code
                );
            });
      	},
      	error: function(event, request, settings) {
            console.log("Erro ao carregar snippets do DB - " + request.responseText);
        }
	});
}

(function(){
	loadSnippets();
})();