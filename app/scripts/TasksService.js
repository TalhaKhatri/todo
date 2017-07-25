var _ = require('../../node_modules/underscore/underscore.js');

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key));
};

/**
 * Get the saved tasks from localStorage or else create a new task list.
 * @constructor
 * 
 */
var TasksService = function (database) {
    this.database = database;
    if (typeof (Storage) !== "undefined") {
        if (localStorage.tasks) {
            this.tasks = localStorage.getObj("tasks");
        } else {
            this.tasks = [];
        }
    } else {
        console.error("Sorry, your browser does not support Web Storage...");
    }
};

TasksService.prototype = _.extend(TasksService, {

    //Updates the local database from server.
    update: function () {
        return this.database.ref('tasks').once('value')
            .then((snapshot) => {
                var tasks = [];
                snapshot.forEach(function (child) {
                    var key = child.key;
                    var value = child.val();
                    value.id = key;
                    tasks.unshift(value);
                });
                this.tasks = tasks;
                console.log(tasks);
            }).catch((err) => {
                console.log(err);
            });
    },

    //Get all tasks.
    getAllTasks: function () {
        return this.tasks;
    },

    /**
     * Get a specific task.
     * @param index - Index value of the task.
     */
    getTask: function (index) {
        return this.tasks[index];
    },

    //Returns all completed tasks.
    getAllCompleteTasks: function () {
        return this.tasks.filter(function (task) {
            return task.completed === true;
        });
    },

    //Returns all incomplete tasks.
    getAllIncompleteTasks: function () {
        return this.tasks.filter(function (task) {
            return task.completed === false;
        });
    },

    //Returns the total number of tasks.
    getTaskCount: function () {
        return this.task.length;
    },

    //Returns the number of completed tasks.
    getCompletedTaskCount: function () {
        return this.getAllCompleteTasks().length;
    },

    //Returns the number of incomplete tasks.
    getIncompleteTaskCount: function () {
        return this.getAllIncompleteTasks().length;
    },

    //Sets a new value for description of task at index.
    setTask: function (index, line) {
        this.tasks[index].description = line;
        this.save();
    },

    /**
    * Add a task.
    * @param line - Description of the task.
    */
    addTask: function (line) {
        var task = { description: line, completed: false };
        this.database.ref('tasks').push(task);
        return this.update();
    },

    /**
     * Remove a specific task.
     * @param index - Index value of the task.
     * @returns The task to be removed.
     */
    removeTask: function (index) {
        console.log(index);
        var task = this.tasks[index];
        return this.database.ref('tasks/'+task.id).remove()
            .then(() => {
                this.tasks.splice(index, 1);
                return task;
            })
            .catch((err) => {   console.log(err); });
    },

    //Removes all completed tasks.
    removeAllCompletedTasks: function () {
        this.tasks = this.getAllIncompleteTasks();
        this.getAllCompleteTasks().forEach(function(task) {
            this.database.ref('tasks/'+task.id).remove()
            .then(() => {
                this.tasks.splice(index, 1);
                return task;
            })
            .catch((err) => {   console.log(err); });
        }, this);
        this.save();
        return this.tasks;
    },

    //Removes all tasks.
    removeAllTasks: function () {
        this.tasks = [];
        this.save();
    },

    /**
     * Toggles a task between complete and incomplete.
     * @param index - Index value of the task.
     */
    toggleTask: function (index) {
        if(this.tasks[index].completed) {
            this.database.ref('tasks/' + this.tasks[index].id)
                .update({ completed: false });
            this.tasks[index].completed = false;
        } else {
            this.database.ref('tasks/' + this.tasks[index].id)
                .update({ completed: true });
            this.tasks[index].completed = true;
        }
        this.save();
    },

    //Toggles all tasks between complete and incomplete.
    toggleAllTasks: function () {
        var incompleteTasks = this.getAllIncompleteTasks();
        if (incompleteTasks.length > 0) {
            this.tasks.forEach(function (task) {
                task.completed = true;
            }, this);
        } else {
            this.tasks.forEach(function (task) {
                task.completed = false;
            }, this);
        }
        this.save();
    },

    //Saves the tasks to local storage.
    save: function () {
        localStorage.setObj("tasks", this.tasks);
    }
});

module.exports = TasksService;