var $ = require('../../bower_components/jquery/dist/jquery.js');
var Handlebars = require('../../node_modules/handlebars/dist/handlebars.min.js');
var View = function() { };

View.prototype = {
    /**
     * Render the notepad on to the screen.
     * @param tasks - List of tasks to be rendered.
     * @param incompleteTaskCount - Number of incomplete tasks.
     * @param completeTaskCount - Number of completes tasks.
     */
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