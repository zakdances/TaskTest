declare var $: any;
declare var moment: any;
declare var dateFromObjectId: (objectId: string) => Date;
declare var updateTaskElementOnBackEnd: (taskEl, taskData) => void;

var paint = (tasks: any[]) => {
    const simpleModal = $('#simple-modal');
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
            const dropdown = newTaskEl.find('.status .dropdown-menu').first();
            const actionIcons = newTaskEl.find('.action-icons').first();
            const editButton = actionIcons.find('.edit-button').first();
            const deleteButton = actionIcons.find('.delete-button').first();

            newTaskEl.bind('update', () => {
                updateTaskElementOnFrontEnd(newTaskEl, taskData);
            });
            newTaskEl.bind('updateOnBackEnd', () => {
                updateTaskElementOnBackEnd(newTaskEl, taskData);
            });
            editButton.click(() => {
                $('#form-modal').modal('toggle');
            });
            deleteButton.click(() => {
                simpleModal.modal('toggle');
                simpleModal.find('button.btn-danger').click(() => {
                    
                });
            });
            newTaskEl.hover(() => {
                actionIcons.toggleClass('invisible');
            });

            // Setup status change
            

            dropdown.children('a').each((i, el) => {
                el = $(el);
                const val = Number(el.data('value'));

                el.click(() => {
                    taskData.status = val;
                    newTaskEl.trigger('update');
                    newTaskEl.trigger('updateOnBackEnd');
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
            statusButtonIcon.attr('class', 'fa fa-genderless fa-fw');
            break;
        case 1:
            statusButtonIcon.attr('class', 'fa fa-refresh fa-fw');
            break;
        case 2:
            statusButtonIcon.attr('class', 'fa fa-check fa-fw');
            break;    
        default:
            break;
    }

    return taskEl;
}

