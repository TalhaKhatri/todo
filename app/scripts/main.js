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
    var incomplete = 0;
    var complete = 0;
    if (typeof(Storage) !== "undefined") {
        if(localStorage.list){
            var list = localStorage.getObj("list");
            list.forEach(function(element) {
                if(element.status == 0){
                    incomplete++;
                    $('#list').append('<div class="item"><i class="material-icons check" id="check">check</i><i class="material-icons cross">close</i><input class="input" type="text" value="' + element.task + '"></div>');
                } else {
                    $('#list').append('<div class="item"><i class="material-icons check green" id="check">check</i><i class="material-icons cross">close</i><input class="input" style="text-decoration: line-through;" type="text" value="' + element.task + '"></div>');
                }   
            }, this);
            complete = list.length - incomplete;
            if(incomplete == 0){
                $('#item-count').toggle();
            }
            if(complete == 0){
                $('#clear').toggle();
            }
            $('#item-count').html(incomplete + ' items left');
            $('#clear').html('Clear completed (' + complete + ')' );
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
               if(incomplete == 0){
                var toggle = true;
               } else {
                var toggle = false;
               }
               var el = {task: $(this).val(), status: 0}
               list.unshift(el);
               localStorage.setObj("list", list);
               incomplete++;
               $('#item-count').html(incomplete + ' items left');
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
        var prevIncomplete = incomplete;
        var prevComplete = complete;
        if(list[index].status == 1){
            $(this).parent().find('input').css('text-decoration', 'line-through');
            incomplete--;
            complete++;
        } else {
            $(this).parent().find('input').css('text-decoration', 'none');
            incomplete++;
            complete--;
        }

        if((incomplete == 0 && prevIncomplete != 0) || (incomplete != 0 && prevIncomplete == 0)){
            var toggleIncomplete = true;
        } else {
            var toggleIncomplete = false;
        }

        if((complete == 0 && prevComplete != 0) || (complete != 0 && prevComplete == 0)){
            var toggleComplete = true;
        } else {
            var toggleComplete = false;
        }

        if(toggleIncomplete){
            $('#item-count').toggle();
        }
        if(toggleComplete){
            $('#clear').toggle();
        }
        $('#item-count').html(incomplete + ' items left');
        $('#clear').html('Clear completed (' + complete + ')' );
        localStorage.setObj("list", list);
    });

    $(document).on('click', '.cross', function() {
        var index = $('.item').index($(this).parent());
        if(list[index].status == 0){
            incomplete--;
        } else {
            complete--;
        }
        $(this).parent().remove();
        list.splice(index, 1);
        localStorage.setObj("list", list);
        if(incomplete == 0) {
            $('#item-count').toggle();
        }
        if(complete == 0) {
            $('#clear').toggle();
        }
        $('#item-count').html(incomplete + ' items left');
        $('#clear').html('Clear completed (' + complete + ')' );
    });

    $('#clear').click(function(){
        var nonRemovables = [];
        var nonRemovableElements = [];
        list.forEach(function(item, index) {
            if(item.status == 0){
                nonRemovables.push(item);
                nonRemovableElements.push($('.item').get(index));
            } 
        }, this);
        $('#list').empty();
        nonRemovableElements.forEach(function(element) {
            $('#list').append(element);
        }, this);
        list = nonRemovables;
        localStorage.setObj("list", list);
        complete = 0;
        $('#clear').toggle();
    });

    $(document).on('mouseover', '.item', function() {
        $(this).find('.cross').toggle();
    });

    $(document).on('mouseout', '.item', function() {
        $(this).find('.cross').toggle();
    });
});
