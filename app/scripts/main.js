import css from '../styles/main.css';
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
    var state = 0;
    var toggleAll = 0;
    // Populate the list from local storage on reload
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
    //Add a new todo
    $('#main').keypress(function(e) {
        if(e.which == 13) {
            if($(this).val() != ""){
                $('#list').prepend('<div class="item"><i class="material-icons check" id="check">check</i><i class="material-icons cross">close</i><input class="input" type="text" value="' + $(this).val() + '"></div>');
               if(state == 2) {
                   $('#list').children().eq(0).toggle(false);
               }
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
    //Toggle a todo between completed and incomplete
    $(document).on('click', '.check', function() {
        $(this).toggleClass('green');
        var index = $('.item').index($(this).parent()); 
        list[index].status = list[index].status === 1 ? 0 : 1;
        var prevIncomplete = incomplete;
        var prevComplete = complete;
        if(list[index].status == 1){
            $(this).parent().find('input').css('text-decoration', 'line-through');
            if(state == 1){
                $(this).parent().toggle();
            }
            incomplete--;
            complete++;
        } else {
            $(this).parent().find('input').css('text-decoration', 'none');
            if(state == 2){
                $(this).parent().toggle();
            }
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
    //Delete a  todo
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
    //Delete all completed todos
    $('#clear').click(function(){
        var nonRemovables = [];
        var nonRemovableElements = [];
        list.forEach(function(item, index) {
            if(item.status == 0){
                nonRemovables.push(item);
            } 
        }, this);
        $('#list').empty();
        list = nonRemovables;
        list.forEach(function(element) {
            if(element.status == 0){
                $('#list').append('<div class="item"><i class="material-icons check" id="check">check</i><i class="material-icons cross">close</i><input class="input" type="text" value="' + element.task + '"></div>');
            } else {
                $('#list').append('<div class="item"><i class="material-icons check green" id="check">check</i><i class="material-icons cross">close</i><input class="input" style="text-decoration: line-through;" type="text" value="' + element.task + '"></div>');
            }   
        }, this);
        localStorage.setObj("list", list);
        if(state == 2){
            list.forEach(function(item, index) {
            if(item.status == 1){
                $('#list').children().eq(index).toggle(true);
            } else {
                $('#list').children().eq(index).toggle(false);
            }
            }, this);
        }
        complete = 0;
        $('#clear').toggle();
    });
    //Show all the complete and incomplete todos
    $('#all').click(function(){
        $('#all').toggleClass('selected', true);
        $('#active').toggleClass('selected', false);
        $('#completed').toggleClass('selected', false);
        state = 0;
        list.forEach(function(item, index) {
            $('#list').children().eq(index).toggle(true);
        }, this);

    });
    //Show only the incomplete todos
    $('#active').click(function(){
        $('#all').toggleClass('selected', false);
        $('#active').toggleClass('selected', true);
        $('#completed').toggleClass('selected', false);
        state = 1;
        list.forEach(function(item, index) {
            if(item.status == 0){
                $('#list').children().eq(index).toggle(true);
            } else {
                $('#list').children().eq(index).toggle(false);
            }
        }, this);

    });
    //Show only the completed todos
    $('#completed').click(function(){
        $('#all').toggleClass('selected', false);
        $('#active').toggleClass('selected', false);
        $('#completed').toggleClass('selected', true);
        state = 2;
        list.forEach(function(item, index) {
            if(item.status == 1){
                $('#list').children().eq(index).toggle(true);
            } else {
                $('#list').children().eq(index).toggle(false);
            }
        }, this);

    });
    //Toggle all todos between complete and incomplete
    $('#done-all').click(function(){
        $(this).toggleClass('green');
        toggleAll = toggleAll === 0 ? 1 : 0;
        if(toggleAll == 1) {
            list.forEach(function(item, index) {
                if(item.status == 0){
                    $('#list').children().eq(index).find('i').toggleClass('green');
                    $('#list').children().eq(index).find('input').css('text-decoration', 'line-through');
                }
                item.status = 1;
            }, this);
            complete = list.length;
            incomplete = 0;
            $('#clear').html('Clear completed (' + complete + ')' );
            $('#item-count').toggle(false);
            $('#clear').toggle(true);
        } else {
            list.forEach(function(item, index) {
                if(item.status == 1){
                    $('#list').children().eq(index).find('i').toggleClass('green');
                    $('#list').children().eq(index).find('input').css('text-decoration', 'none');
                } 
                item.status = 0;
            }, this);
            complete = 0;
            $('#clear').toggle(false);
            $('#item-count').toggle(true);
            $('#clear').html('Clear completed (' + complete + ')' );
        }

        if(state == 1){
            list.forEach(function(item, index) {
                if(item.status == 0){
                    $('#list').children().eq(index).toggle(true);
                } else {
                    $('#list').children().eq(index).toggle(false);
                }
            }, this);
        } else if(state == 2) {
            list.forEach(function(item, index) {
                if(item.status == 1){
                    $('#list').children().eq(index).toggle(true);
                } else {
                    $('#list').children().eq(index).toggle(false);
                }
            }, this);
        }
        
    })

    $(document).on('change', '.item', function(){
        var index = $('.item').index($(this));
        list[index].task = $(this).find('input').val();
        localStorage.setObj("list", list);
    })
    //Show the cross for deleting a todo on hover
    $(document).on('mouseover', '.item', function() {
        $(this).find('.cross').toggle();
    });
    //Hide the cross when mouse moves out of the element
    $(document).on('mouseout', '.item', function() {
        $(this).find('.cross').toggle();
    });
});
