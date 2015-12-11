'use strict';

var aside = document.querySelector('aside');
var nav = document.querySelector('nav');
var main = document.querySelector('main');
var sideMenu = document.querySelector('.side-menu i');
sideMenu.addEventListener('click', toggleSideMenu, false);

function toggleSideMenu() {
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

function setSnippet(){
	/*
	var encodedData = window.btoa("Hello, world"); // encode a string
	var decodedData = window.atob(encodedData); // decode the string
	*/

	var title = document.querySelector('#snpTitle').value;
	var code = document.querySelector('#snpCode').value;
	var faIcon = document.querySelector('#snpIcon').value;
	var list = document.querySelector('.snippets');

	var myModal = document.querySelector('#myModal');
	var modal = new Modal( myModal );

	var newSnippet = document.createElement("li");
		newSnippet.classList.add("snippet-item");	
		newSnippet.setAttribute("data-original-title", "Snippet");
		newSnippet.setAttribute("data-code", window.btoa(code));

		newSnippet.setAttribute("id", "snp"+getId());

	var icon = document.createElement("i");
		icon.classList.add("fa");
		icon.classList.add(faIcon);

	newSnippet.appendChild( icon );
	newSnippet.appendChild( document.createTextNode(title) );
	//TODO - CODE REPRESENTATION
	list.appendChild(newSnippet);

	modal.close();
	
}