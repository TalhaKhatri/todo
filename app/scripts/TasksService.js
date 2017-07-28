var _ = require('../../node_modules/underscore/underscore.js');
if (typeof (Storage) !== "undefined") {
    Storage.prototype.setObj = (key, obj) => {
        return this.setItem(key, JSON.stringify(obj));
    };
    Storage.prototype.getObj = (key) => {
        return JSON.parse(this.getItem(key));
    };
}
/**
 * Get the saved tasks from localStorage or else create a new task list.
 * @constructor
 * 
 */
var TasksService = (database) => {
    this.database = database;
    this.tags = [];
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
    update: () => {
        return this.database.ref('tasks').once('value')
            .then((snapshot) => {
                var tasks = [];
                snapshot.forEach((child) => {
                    var key = child.key;
                    var value = child.val();
                    value.id = key;
                    tasks.unshift(value);
                });
                this.tasks = tasks;
                this.save();
                console.log(tasks);
            }).catch((err) => {
                console.log(err);
            });
    },

    //Get all tasks. //COMPLETE THIS
    getAllTasks: () => {
        if(this.tags.length === 0){
            return this.tasks;
        } else {
            return this.tasks.filter((task) => {
            return task.tags.contain;
        });
        }
    },

    /**
     * Get a specific task.
     * @param index - Index value of the task.
     */
    getTask: (index) => {
        return this.tasks[index];
    },

    //Returns all completed tasks.
    getAllCompleteTasks: () => {
        return this.tasks.filter((task) => {
            return task.completed === true;
        });
    },

    //Returns all incomplete tasks.
    getAllIncompleteTasks: () => {
        return this.tasks.filter((task) => {
            return task.completed === false;
        });
    },

    //Returns the total number of tasks.
    getTaskCount: () => {
        return this.task.length;
    },

    //Returns the number of completed tasks.
    getCompletedTaskCount: () => {
        return this.getAllCompleteTasks().length;
    },

    //Returns the number of incomplete tasks.
    getIncompleteTaskCount: () => {
        return this.getAllIncompleteTasks().length;
    },

    //Sets a new value for description of task at index.
    setTask: (index, line, date) => {
        this.tasks[index].description = line;
        this.tasks[index].dueDate = date;
        this.database.ref('tasks/' + this.tasks[index].id)
                .update({ description: line, dueDate: date });
        this.save();
    },

    /**
    * Add a task.
    * @param line - Description of the task.
    */
    addTask: (line, dueDate, tagString) => {
        var tags = [];
        tagString.split(',').forEach((tag) => {
            tags.push(tag);
        }, this);
        var task = { description: line, dueDate: dueDate, tags: tags, completed: false };
        this.database.ref('tasks').push(task);
        return this.update();
    },

    /**
     * Remove a specific task.
     * @param index - Index value of the task.
     * @returns The task to be removed.
     */
    removeTask: (index) => {
        console.log(index);
        var task = this.tasks[index];
        return this.database.ref('tasks/'+task.id).remove()
            .then(() => {
                this.tasks.splice(index, 1);
                this.save();
                return task;
            })
            .catch((err) => {   console.log(err); });
    },

    //Removes all completed tasks.
    removeAllCompletedTasks: () => {
        this.getAllCompleteTasks().forEach((task) => {
            this.database.ref('tasks/'+task.id).remove()
            .catch((err) => {   console.log(err); });
        }, this);
        this.tasks = this.getAllIncompleteTasks();
        this.save();
        return this.tasks;
    },

    //Removes all tasks.
    removeAllTasks: () => {
        this.tasks.forEach((task) => {
            this.database.ref('tasks/'+task.id).remove()
            .catch((err) => { console.log(err); });
        }, this);
        this.tasks = [];
        this.save();
    },

    /**
     * Toggles a task between complete and incomplete.
     * @param index - Index value of the task.
     */
    toggleTask: (index) => {
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
    toggleAllTasks: () => {
        var incompleteTasks = this.getAllIncompleteTasks();
        if (incompleteTasks.length > 0) {
            this.tasks.forEach( (task) => {
                this.database.ref('tasks/' + task.id)
                .update({ completed: true });
                task.completed = true;
            }, this);
        } else {
            this.tasks.forEach((task) => {
                this.database.ref('tasks/' + task.id)
                .update({ completed: false });
                task.completed = false;
            }, this);
        }
        this.save();
    },

    //Filters through the tasks to find ones with the specified tags
    filter: (tagsString) => {
        var tags = [];
        tagsString.split(',').forEach((tag) => {
            tags.push(tag);
        }, this);
        this.tags = tags;
    },

    //Saves the tasks to local storage.
    save: () => {
        localStorage.setObj("tasks", this.tasks);
    }
});

module.exports = TasksService;