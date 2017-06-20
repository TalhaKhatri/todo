
var $ = require('../../bower_components/jquery/dist/jquery.js');
var Handlebars = require('../../node_modules/handlebars/dist/handlebars.min.js');
var View = function() { };

View.prototype = {
    render: function(tasks) {
        $('#list').empty();
        var source = $('#task-template').html().replace(/[\u200B]/g, '');
        var template = Handlebars.compile(source);
        var result = template(tasks);
        $('#list').append(result);
    }
};

module.exports = View;