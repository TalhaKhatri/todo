import css from '../styles/main.css';
var $ = require('../../bower_components/jquery/dist/jquery.js');
var TasksService = require('./TasksService.js');
var View = require('./View.js');




Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

$(document).ready(function(){
    var tasksService = new TasksService();
    var view = new View();
    /*console.log(tasksService.getAllTasks());    
    console.log(tasksService.addTask('Dance till you drop'));
    console.log(tasksService.addTask('Play checkers'));
    console.log(tasksService.addTask('Cry a river'));
    */
    view.render(tasksService.getAllTasks());
    console.log(tasksService.getAllTasks());
    var incomplete = 0;
    var complete = 0;
    var state = 0;
    var toggleAll = 0;
    // Populate the list from local storage on reload
    /*if (typeof(Storage) !== "undefined") {
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
    }   */
    //Add a new todo
    var refresh = function() {
        switch(state) {
            case 0:
                view.render(tasksService.getAllTasks());
                break;
            case 1:
                view.render(tasksService.getAllIncompleteTasks());
                break;
            case 2:
                view.render(tasksService.getAllCompleteTasks());
                break;
        }
    };

    var getActualIndex = function(index) {
        switch(state) {
            case 0:
                return index;
            case 1:
                var count = -1;
                var tasks = tasksService.getAllTasks();
                for (var itr = 0; itr < tasks.length; itr++) {
                    var task = tasks[itr];
                    if(!task.completed){
                        count++;
                    }
                    if(count == index){
                        index = itr;
                        break;
                    }
                }
                return index;
            case 2:
                var count = -1;
                var tasks = tasksService.getAllTasks();
                for (var itr = 0; itr < tasks.length; itr++) {
                    var task = tasks[itr];
                    if(task.completed){
                        count++;
                    }
                    if(count == index){
                        index = itr;
                        break;
                    }
                }
                return index;
        }
        refresh();
    };

    $('#main').keypress(function(e) {
        if(e.which == 13) {
            if($(this).val() != ""){
                tasksService.addTask($(this).val());
                view.render(tasksService.getAllTasks());
                $(this).val(""); 
            }
        }
    });
    //Toggle a todo between completed and incomplete
    $(document).on('click', '.check', function() {
        var index = $('.item').index($(this).parent());
        index = getActualIndex(index);
        tasksService.toggleTask(index);
        refresh();
    });
    //Delete a  todo
    $(document).on('click', '.cross', function() {
        var index = $('.item').index($(this).parent());
        tasksService.removeTask(index);
        refresh();
    });
    //Delete all completed todos
    $('#clear').click(function(){
        tasksService.removeAllCompletedTasks();
        refresh();
    });
    //Show all the complete and incomplete todos
    $('#all').click(function(){
        $('#all').toggleClass('selected', true);
        $('#active').toggleClass('selected', false);
        $('#completed').toggleClass('selected', false);
        state = 0;
        refresh();
    });
    //Show only the incomplete todos
    $('#active').click(function(){
        $('#all').toggleClass('selected', false);
        $('#active').toggleClass('selected', true);
        $('#completed').toggleClass('selected', false);
        state = 1;
        refresh();
    });
    //Show only the completed todos
    $('#completed').click(function(){
        $('#all').toggleClass('selected', false);
        $('#active').toggleClass('selected', false);
        $('#completed').toggleClass('selected', true);
        state = 2;
        refresh();
    });
    //Toggle all todos between complete and incomplete
    $('#done-all').click(function(){
        tasksService.toggleAllTasks();
        refresh();
    });

    $(document).on('change', '.item', function(){
        var index = $('.item').index($(this));
        index = getActualIndex(index);
        tasksService.setTask(index, $(this).find('input').val());
        refresh();
    });
    //Show the cross for deleting a todo on hover
    $(document).on('mouseover', '.item', function() {
        $(this).find('.cross').toggle();
    });
    //Hide the cross when mouse moves out of the element
    $(document).on('mouseout', '.item', function() {
        $(this).find('.cross').toggle();
    });
});
