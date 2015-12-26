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

function getSnippetModal() {

    var myModal = document.querySelector('#myModal');
    var snippetModal = new Modal(myModal);

    return snippetModal;
}

function setSnippet(description, icon, code) {

    var list = document.querySelector('.snippets');
    var newSnippet = document.createElement("li");
    newSnippet.classList.add("snippet-item");
    newSnippet.setAttribute("data-original-title", "Snippet");
    newSnippet.setAttribute("data-code", code);

    newSnippet.setAttribute("id", "snp" + getId());

    var faIcon = document.createElement("i");
    faIcon.classList.add("fa");
    faIcon.classList.add(icon);

    newSnippet.appendChild(faIcon);
    newSnippet.appendChild(document.createTextNode(description));
    //TODO - CODE REPRESENTATION
    list.appendChild(newSnippet);
}


function getSnippets() {

    $.ajax({
        url: "http://localhost:1111/snippet/",
        method: "GET",
        crossDomain: true,
        contentType: "application/json",
		cache: false,
        dataType: "json",
        success: function(ajax) {
            if (ajax) {
                $.each(ajax, function(index, item) {
                    setSnippet(
                        item.description,
                        item.icon,
                        item.code
                    );
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Erro ao executar getSnippets() - " + textStatus);
        }
    });
}

function addSnippet() {

	var description = $("#snpDescription").val();
	var icon = $("#snpIcon").val();
	var code = window.btoa($("#snpCode").val());

	var snippetModal = getSnippetModal();
	snippetModal.close()

    $.ajax({
        url: "http://localhost:1111/snippet",
        method: "POST",
        crossDomain: true,
        data: '{"description":"'+description+'","icon":"'+icon+'","code":"'+code+'"}',
		contentType: "application/json",
		cache: false,
        dataType: "json",
        complete: function(jqXHR, textStatus) {
            setSnippet(description, icon, code);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Erro ao executar addSnippet() - " + textStatus);
        }
    });
}

function cleanSnippets() {
	$('.snippets').empty();
}

(function() {
    getSnippets();
})();
