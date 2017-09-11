var paint = function (tasks) {
    var container = $('#tasks');
    if (tasks.length > 0) {
        container.html('');
    }
    tasks.forEach(function (taskData, i, a) {
        // const task = v;
        if (taskData && taskData.label) {
            // const time = dateFromObjectId(task._id.$id);
            // const relativeTime = moment.unix(taskData.dueDate.sec).fromNow();
            var newTaskEl_1 = $('#task').clone();
            newTaskEl_1.bind('update', function () {
                updateTaskElementOnFrontEnd(newTaskEl_1, taskData);
            });
            // Setup status change
            var dropdown = newTaskEl_1.find('.status .dropdown-menu').first();
            dropdown.children('a').each(function (i, el) {
                el = $(el);
                var val = Number(el.data('value'));
                el.click(function () {
                    taskData.status = val;
                    newTaskEl_1.trigger('update');
                });
            });
            // newTaskEl.find('.label').html('<span>' + taskData.label + '</span>');
            // newTaskEl.find('.time-label').find('span.text').html('<span>' + relativeTime + '</span>');
            // newTaskEl.css('display', 'block');
            // const label = task.label;
            // const newEl = $('<div class="container"><div class="row"><div></div><div class="label">' + label + '</div><div>Not Done</div></div></div>');
            newTaskEl_1.trigger('update');
            container.append(newTaskEl_1);
        }
    });
};
var updateTaskElementOnFrontEnd = function (taskEl, taskData) {
    var now = moment();
    var dueDate = moment.unix(taskData.dueDate.sec);
    var diff = dueDate.unix() - now.unix();
    // console.log('diff: ' + diff);
    var relativeTime = dueDate.fromNow();
    var statusButtonIcon = taskEl.find('.status button div').first();
    var dueBadgeSpan = taskEl.find('.due-badge span').first();
    taskEl.prop('_id', taskData._id.$id);
    taskEl.find('.label').html('<span>' + taskData.label + '</span>');
    taskEl.find('.time-label').find('span.text').html('<span>' + relativeTime + '</span>');
    taskEl.css('display', 'block');
    if (diff > 0 && diff < 86400) {
        dueBadgeSpan.removeClass('invis');
    }
    else {
        dueBadgeSpan.addClass('invis');
    }
    switch (Number(taskData.status)) {
        case 0:
            statusButtonIcon.attr('class', 'fa fa-square-o fa-fw');
            break;
        case 1:
            statusButtonIcon.attr('class', 'fa fa-spinner fa-fw');
            break;
        case 2:
            statusButtonIcon.attr('class', 'fa fa-check fa-fw');
            break;
        default:
            break;
    }
    return taskEl;
};
