var $ = require('../../bower_components/jquery/dist/jquery.js');

var Controller = (tasksService, view) => {
    this.tasksService = tasksService;
    this.view = view;
    this.state = 0;
};

Controller.prototype = {

    //Refresh the view
    refresh: () => {
        switch(this.state) {
            case 0:
                this.view.render(this.tasksService.getAllTasks(),
                            this.tasksService.getIncompleteTaskCount(),
                            this.tasksService.getCompletedTaskCount());
                break;
            case 1:
                this.view.render(this.tasksService.getAllIncompleteTasks(), 
                            this.tasksService.getIncompleteTaskCount(), 
                            this.tasksService.getCompletedTaskCount());
                break;
            case 2:
                this.view.render(this.tasksService.getAllCompleteTasks(), 
                            this.tasksService.getIncompleteTaskCount(), 
                            this.tasksService.getCompletedTaskCount());
                break;
        }
    },

    /**
     * Calculate the actual index of a task in each state.
     * @param index - The index value of the task in the DOM.
     */
    getActualIndex: (index) => {
        switch(this.state) {
            case 0:
                return index;
            case 1:
                var count = -1;
                var tasks = this.tasksService.getAllTasks();
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
                var tasks = this.tasksService.getAllTasks();
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
        this.refresh();
    },
    
    //Start the controller
    start: () => {
        this.refresh();
        var controller = this;
        //Add a new task on enter key press.
        $('#main-box').keypress((e) => {
            if(e.which == 13) {
                if($('#main').val() !== "" && $('#duedate').val() !== ""){
                    controller.tasksService.addTask($('#main').val(), 
                                                    $('#duedate').val(), 
                                                    $('#tags').val())
                    .then(() => {
                        controller.refresh();
                        $('#main').val("");
                        $('#duedate').val("");
                        $('#tags').val("");
                    });
                }
            }
        });
        //Toggle a todo between completed and incomplete
        $(document).on('click', '.check', () => {
            var index = $('.item').index($(this).parent());
            index = controller.getActualIndex(index);
            controller.tasksService.toggleTask(index);
            controller.refresh();
        });
        //Delete a  todo
        $(document).on('click', '.cross', () => {
            var index = $('.item').index($(this).parent());
            controller.tasksService.removeTask(index).then(() => {
                controller.refresh();
            }); 
        });
        //Delete all completed todos
        $('#clear').click(() => {
            controller.tasksService.removeAllCompletedTasks();
            controller.refresh();
        });
        //Show all the complete and incomplete todos
        $('#all').click(() => {
            $('#all').toggleClass('selected', true);
            $('#active').toggleClass('selected', false);
            $('#completed').toggleClass('selected', false);
            controller.state = 0;
            controller.refresh();
        });
        //Show only the incomplete todos
        $('#active').click(() => {
            $('#all').toggleClass('selected', false);
            $('#active').toggleClass('selected', true);
            $('#completed').toggleClass('selected', false);
            controller.state = 1;
            controller.refresh();
        });
        //Show only the completed todos
        $('#completed').click(() => {
            $('#all').toggleClass('selected', false);
            $('#active').toggleClass('selected', false);
            $('#completed').toggleClass('selected', true);
            controller.state = 2;
            controller.refresh();
        });
        //Toggle all todos between complete and incomplete
        $('#done-all').click(() => {
            controller.tasksService.toggleAllTasks();
            controller.refresh();
        });

        $('#search').onChange(() => {
            var tags = $('#search').val();
            controller.tasksService.filter(tags);
            controller.refresh();
        });

        //When a task's value changes save the new value
        $(document).on('change', '.item', () => {
            var index = $('.item').index($(this));
            index = controller.getActualIndex(index);
            controller.tasksService.setTask(index, 
                $(this).find('#description').val(), 
                $(this).find('#date').val());
            controller.refresh();
        });
        //Show the cross for deleting a todo on hover
        $(document).on('mouseover', '.item', () => {
            $(this).find('.cross').toggle();
        });
        //Hide the cross when mouse moves out of the element
        $(document).on('mouseout', '.item', () => {
            $(this).find('.cross').toggle();
        });
    }
};

module.exports = Controller;