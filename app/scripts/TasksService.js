var _ = require('../../node_modules/underscore/underscore.js');

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
};

/**
 * Get the saved tasks from localStorage or else create a new task list.
 * @constructor
 * 
 */
var tasksService = function() {
    if (typeof(Storage) !== "undefined") {
        if(localStorage.taskList){
            this.tasks = localStorage.getObj("tasks");
        } else {
            this.tasks = [];
        }
    } else {
        console.error("Sorry, your browser does not support Web Storage...");
    }
};

tasksService.prototype = _.extend(tasksService, {

    //Get all tasks.
    getAllTasks: function() {
        return this.tasks;
    },

    /**
     * Get a specific task.
     * @param index - Index value of the task.
     */
    getTask: function(index) {
        return this.tasks[index];
    },

    //Returns all completed tasks.
    getAllCompleteTasks: function() {
        return this.tasks.filter(function(task) {
            return task.completed === true;
        });
    },

    //Returns all incomplete tasks.
    getAllIncompleteTasks: function() {
        return this.tasks.filter(function(task){
            return task.completed === false;
        });
    },

     /**
     * Add a task.
     * @param line - Description of the task.
     */
    addTask: function(line) {
        var task = { description: line, completed: false };
        this.tasks.unshift(task);
        localStorage.setObj("tasks", this.tasks);
        return true;
    },

    /**
     * Remove a specific task.
     * @param index - Index value of the task.
     * @returns The task to be removed.
     */
    removeTask: function(index) {
        var task = this.tasks.splice(index, 1);
        localStorage.setObj("tasks", this.tasks);
        return task;
    },

    //Removes all completed tasks.
    removeAllCompletedTasks: function() {
        this.tasks = this.getAllIncompleteTasks();
        localStorage.setObj("tasks", this.tasks);
        return this.tasks;
    }

});