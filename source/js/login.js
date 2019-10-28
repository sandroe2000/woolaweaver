'use strict';

$(document).ready(function(){
    greet(); 
}); 

let imgs = ["kRanI4v.jpg", "kRanI5v.jpg", "kRanI6v.jpg", "kRanI7v.jpg"];
    
function greet(){
    let img = getRandom(imgs);
    $('body').css("background-image", `url("/img/${img}")`);
}

function getRandom(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

setInterval(function(){
    greet();
}, 10000);

