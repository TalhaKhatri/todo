import css from '../styles/main.css';
var $ = require('../../bower_components/jquery/dist/jquery.js');
var TasksService = require('./TasksService.js');
var View = require('./View.js');
var Controller = require('./Controller.js');


$(document).ready(function(){
    var tasksService = new TasksService();
    var view = new View();
    var controller = new Controller(tasksService, view);
    controller.start();
});
