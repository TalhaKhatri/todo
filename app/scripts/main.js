import css from '../styles/main.css';
console.log('\'Allo \'Allo!');
var $ = require('../../bower_components/jquery/dist/jquery.js');

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function(){
    
    if (typeof(Storage) !== "undefined") {
        if(localStorage.list){
            var list = localStorage.getObj("list");
            list.forEach(function(element) {
                if(element.status == 0){
                    $('#list').append('<div class="item"><i class="material-icons check" id="check">check</i><i class="material-icons cross">close</i><input class="input" type="text" value="' + element.task + '"></div>');
                } else {
                    $('#list').append('<div class="item"><i class="material-icons check green" id="check">check</i><i class="material-icons cross">close</i><input class="input" style="text-decoration: line-through;" type="text" value="' + element.task + '"></div>');
                }   
            }, this);
            if(list.length == 0){
                $('#item-count').toggle();
            }
            $('#item-count').html(list.length + ' items left');
        } else {
            var list = [];
        }
    } else {
        document.getElementById("title").innerHTML = "Sorry, your browser does not support Web Storage...";
    }   

    $('#main').keypress(function(e) {
        if(e.which == 13) {
            if($(this).val() != ""){
               $('#list').prepend('<div class="item"><i class="material-icons check" id="check">check</i><i class="material-icons cross">close</i><input class="input" type="text" value="' + $(this).val() + '"></div>');
               if(list.length == 0){
                var toggle = true;
               } else {
                var toggle = false;
               }
               var el = {task: $(this).val(), status: 0}
               list.unshift(el);
               localStorage.setObj("list", list);
               $('#item-count').html(list.length + ' items left');
               if(toggle){
                   $('#item-count').toggle();
                } 
               $(this).val(""); 
            }
        }
    });

    $(document).on('click', '.check', function() {
        $(this).toggleClass('green');
        var index = $('.item').index($(this).parent()); 
        list[index].status = list[index].status === 1 ? 0 : 1;
        if(list[index].status == 1){
            $(this).parent().find('input').css('text-decoration', 'line-through');
        } else {
            $(this).parent().find('input').css('text-decoration', 'none');
        }
        
        localStorage.setObj("list", list);
    });

    $(document).on('click', '.cross', function() {
        var index = $('.item').index($(this).parent());
        $(this).parent().remove();
        list.splice(index, 1);
        localStorage.setObj("list", list);
        if(list.length == 0) {
            $('#item-count').toggle();
        }
        $('#item-count').html(list.length + ' items left');
    });

    $(document).on('mouseover', '.item', function() {
        $(this).find('.cross').toggle();
    });

    $(document).on('mouseout', '.item', function() {
        $(this).find('.cross').toggle();
    });
});
