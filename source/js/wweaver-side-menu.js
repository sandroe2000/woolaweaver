'use strict';

var aside = document.querySelector('aside');
var nav = document.querySelector('nav');
var main = document.querySelector('main');
var sideMenu = document.querySelector('.side-menu');
sideMenu.addEventListener('click', toggleSideMenu, false);

function toggleSideMenu() {
    if (aside.offsetLeft == -160) {
        aside.style.left = "0px";

        main.style.left = "190px";
        //main.style.width = (main.offsetWidth - 160) + "px";

        nav.style.left = "190px";
        //nav.style.width = (nav.offsetWidth - 160) + "px";
    } else {
        aside.style.left = "-160px";

        main.style.left = "30px";
        //main.style.width = (main.offsetWidth + 160) + "px";

        nav.style.left = "30px";
        //nav.style.width = (nav.offsetWidth + 160) + "px";
    }
}
