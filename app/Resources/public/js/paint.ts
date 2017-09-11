declare var $: any;
declare var moment: any;
declare var dateFromObjectId: (objectId: string) => Date;

var paint = (tasks: any[]) => {
    const container = $('#tasks');
    if (tasks.length > 0) {
        container.html('');
    }
    
    tasks.forEach((taskData, i, a) => {
        // const task = v;
        if (taskData && taskData.label) {
            // const time = dateFromObjectId(task._id.$id);
            // const relativeTime = moment.unix(taskData.dueDate.sec).fromNow();


            const newTaskEl = $('#task').clone();
            newTaskEl.bind('update', () => {
                updateTaskElementOnFrontEnd(newTaskEl, taskData);
            });

            // Setup status change
            const dropdown = newTaskEl.find('.status .dropdown-menu').first();

            dropdown.children('a').each((i, el) => {
                el = $(el);
                const val = Number(el.data('value'));

                el.click(() => {
                    taskData.status = val;
                    newTaskEl.trigger('update');
                });
              });
            // newTaskEl.find('.label').html('<span>' + taskData.label + '</span>');
            // newTaskEl.find('.time-label').find('span.text').html('<span>' + relativeTime + '</span>');
            // newTaskEl.css('display', 'block');
            // const label = task.label;
            // const newEl = $('<div class="container"><div class="row"><div></div><div class="label">' + label + '</div><div>Not Done</div></div></div>');
            newTaskEl.trigger('update');
            container.append(newTaskEl);
            
        }
    });
}

var updateTaskElementOnFrontEnd = (taskEl, taskData) => {
    
    const now = moment();
    const dueDate = moment.unix(taskData.dueDate.sec);
    const diff = dueDate.unix() - now.unix();
    // console.log('diff: ' + diff);

    const relativeTime = dueDate.fromNow();
    const statusButtonIcon = taskEl.find('.status button div').first();
    const dueBadgeSpan = taskEl.find('.due-badge span').first();

    taskEl.prop('_id', taskData._id.$id);
    taskEl.find('.label').html('<span>' + taskData.label + '</span>');
    taskEl.find('.time-label').find('span.text').html('<span>' + relativeTime + '</span>');
    taskEl.css('display', 'block');

    if (diff > 0 && diff < 86400) {
        dueBadgeSpan.removeClass('invis');
    } else {
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
}