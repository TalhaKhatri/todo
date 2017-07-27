import css from '../styles/main.css';
var $ = require('../../bower_components/jquery/dist/jquery.js');
var TasksService = require('./TasksService.js');
var View = require('./View.js');
var Controller = require('./Controller.js');
var firebase = require("firebase");

$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyCeiqxnv42kLFL_xactaVosFl3EJXaJFLE",
        authDomain: "todo-app-45ba6.firebaseapp.com",
        databaseURL: "https://todo-app-45ba6.firebaseio.com",
        projectId: "todo-app-45ba6",
        storageBucket: "todo-app-45ba6.appspot.com",
        messagingSenderId: "342607239117"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    firebase.auth().signInAnonymously()
        .then(() => {
            firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
            console.log('Anonymous user logged in.', user)
            } else {
                // User is signed out.
            console.log('Anonymous user signed out.')
                // ...
            }
            });
            var view = new View();
            var tasksService = new TasksService(database);
            var controller = new Controller(tasksService, view);
            controller.start();
            tasksService.update().then(() => {
                controller.refresh();
            });
        })
        .catch(function(error) {
        console.log(error);
        });
    
});
