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
var TasksService = function() {
    if (typeof(Storage) !== "undefined") {
        if(localStorage.tasks){
            this.tasks = localStorage.getObj("tasks");
        } else {
            this.tasks = [];
        }
    } else {
        console.error("Sorry, your browser does not support Web Storage...");
    }
};

TasksService.prototype = _.extend(TasksService, {

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

    //Sets a new value for description of task at index.
    setTask: function(index, line) {
        this.tasks[index].description = line;
        this.save();
    },

     /**
     * Add a task.
     * @param line - Description of the task.
     */
    addTask: function(line) {
        var task = { description: line, completed: false };
        this.tasks.unshift(task);
        this.save();
        return true;
    },

    /**
     * Remove a specific task.
     * @param index - Index value of the task.
     * @returns The task to be removed.
     */
    removeTask: function(index) {
        var task = this.tasks.splice(index, 1);
        this.save();
        return task;
    },

    //Removes all completed tasks.
    removeAllCompletedTasks: function() {
        this.tasks = this.getAllIncompleteTasks();
        this.save();
        return this.tasks;
    },

    removeAllTasks: function() {
        this.tasks = [];
        this.save();
    },

    /**
     * Toggles a task between complete and incomplete.
     * @param index - Index value of the task.
     */
     toggleTask: function(index) {
         this.tasks[index].completed = this.tasks[index].completed ? false : true;
         this.save();
     },

    //Toggles all tasks between complete and incomplete.
    toggleAllTasks: function() {
        var incompleteTasks = this.getAllIncompleteTasks();
        if(incompleteTasks.length > 0){
            this.tasks.forEach(function(task) {
                task.completed = true;
            }, this);
        } else {
            this.tasks.forEach(function(task) {
                task.completed = false;
            }, this);
        }
        this.save();
    },

    save: function() {
        localStorage.setObj("tasks", this.tasks);
    }
});

module.exports = TasksService;