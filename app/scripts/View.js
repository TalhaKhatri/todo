var $ = require('../../bower_components/jquery/dist/jquery.js');
var Handlebars = require('../../node_modules/handlebars/dist/handlebars.min.js');
var View = function() { };

View.prototype = {
    render: function(tasks, incompleteTaskCount, completeTaskCount) {
        $('#list').empty();
        $('#item-count').empty();
        $('#clear').toggle(false);
        var source = $('#task-template').html().replace(/[\u200B]/g, '');
        var template = Handlebars.compile(source);
        var result = template(tasks);
        $('#list').append(result);
        if(incompleteTaskCount > 0) {
            $('#item-count').html(incompleteTaskCount + ' items left');
        }
        if(completeTaskCount > 0) {
            $('#clear').html('Clear ('+ completeTaskCount +')');
            $('#clear').toggle(true);
        }
    }
};

module.exports = View;