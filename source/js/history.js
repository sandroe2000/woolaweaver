'use strict';

$('#menuTextEditor').on('change', function(event){
    window.location.href=$(this).val();
});