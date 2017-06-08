import css from '../styles/main.css';
console.log('\'Allo \'Allo!');
var $ = require('../../bower_components/jquery/dist/jquery.js');
$(document).ready(function(){
    $('#main').keypress(function(e) {
        if(e.which == 13) {
            if($(this).val() != ""){
               $('#list').prepend('<div class="item"><i class="material-icons check" id="check">check</i><i class="material-icons cross">close</i><input class="input" type="text" value="' + $(this).val() + '"></div>');
               $(this).val("");
            }
        }
    });

    $(document).on('click', '.check', function() {
        $(this).toggleClass('green');
        $(this).parent().find('input').css('text-decoration', 'line-through');

    });

    $(document).on('click', '.cross', function() {
        $(this).parent().remove();
    });

    $(document).on('mouseover', '.item', function() {
        $(this).find('.cross').toggle();
    });

    $(document).on('mouseout', '.item', function() {
        $(this).find('.cross').toggle();
    });
});
