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
