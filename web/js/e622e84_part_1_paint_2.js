var paint = function (tasks) {
    var container = $('#tasks');
    if (tasks.length > 0) {
        container.html('');
    }
    tasks.forEach(function (task, i, a) {
        // const task = v;
        if (task && task.label) {
            // const time = dateFromObjectId(task._id.$id);
            var relativeTime = moment.unix(task.dueDate.sec).fromNow();
            var newTask = $('#task').clone();
            newTask.find('.label').html('<span>' + task.label + '</span>');
            newTask.find('.time-label').find('span.text').html('<span>' + relativeTime + '</span>');
            newTask.css('display', 'block');
            // const label = task.label;
            // const newEl = $('<div class="container"><div class="row"><div></div><div class="label">' + label + '</div><div>Not Done</div></div></div>');
            container.append(newTask);
        }
    });
};
