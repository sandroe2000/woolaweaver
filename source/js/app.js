'use strict';

$('#toggleLeftMenu').on('click', function(event){
    $('.main-menu').toggleClass('left-to-right');
    $(this).find('i').toggleClass('mdi-last-page mdi-first-page');
});

$('#toggleRightMenu').on('click', function(event){
    $('.right-menu').toggleClass('right-to-left');
    $(this).find('i').toggleClass('mdi-last-page mdi-first-page');
});