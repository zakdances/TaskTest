declare var $: any;
declare var moment: any;
declare var dateFromObjectId: (objectId: string) => Date;
declare var updateTaskElementOnBackEnd: (taskEl, taskData) => void;
declare var deleteTaskElementOnBackEnd: (taskEl, taskData) => void;

var paint = (tasks: any[]) => {
    const formModal = $('#form-modal');
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
            const editButton = actionIcons.find('button.edit-button').first();
            const deleteButton = actionIcons.find('button.delete-button').first();
            const modalDeleteButton = simpleModal.find('button.btn-danger').first();
            const modalTaskFormSaveButton = formModal.find('button.btn-primary').first();

            newTaskEl.bind('update', () => {
                updateTaskElementOnFrontEnd(newTaskEl, taskData);
            });
            newTaskEl.bind('updateOnBackEnd', () => {
                updateTaskElementOnBackEnd(newTaskEl, taskData);
            });
            newTaskEl.bind('delete', () => {
                updateTaskElementOnFrontEnd(newTaskEl, taskData, true);
                deleteTaskElementOnBackEnd(newTaskEl, taskData);
            });
            newTaskEl.hover(() => {
                actionIcons.toggleClass('invisible');
            });


            const modalCallbackName = 'click.id_' + taskData.id;

            editButton.click(() => {
                formModal.data('task', taskData);
                formModal.modal('toggle');
                // modalTaskFormSaveButton.on(modalCallbackName, () => {
                //     // console.log('deleting a task...');
                //     newTaskEl.trigger('update');
                //     // simpleModal.modal('toggle');
                // });
            });

            deleteButton.click(() => {
                simpleModal.modal('toggle');
                modalDeleteButton.on(modalCallbackName, () => {
                    console.log('deleting a task...');
                    newTaskEl.trigger('delete');
                    simpleModal.modal('toggle');
                });
            });
            // const deleteClickCallback = () => {
            //     simpleModal.modal('toggle');
            //     simpleModal.find('button.btn-danger').first().click(() => {
            //         newTaskEl.trigger('delete');
            //     });
            // };

            // formModal.on('hidden.bs.modal', function (e) {
            //     // do something...
            //     modalTaskFormSaveButton.off(modalCallbackName);
            // });
            simpleModal.on('hidden.bs.modal', function (e) {
                // do something...
                modalDeleteButton.off(modalCallbackName);
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

// TODO: Make sure to eliminate data from array if neccesary
var updateTaskElementOnFrontEnd = (taskEl, taskData, deleteTask?: boolean) => {
    
    if (deleteTask === true) {
        taskEl.remove();
        return taskEl;
    }
    const now = moment();
    
    console.log('try: ' + taskData.dueDate);
    const dueDate = moment.unix(taskData.dueDate);
    console.log('try: ' + dueDate);

    const diff = dueDate.unix() - now.unix();
    const relativeTime = dueDate.fromNow();
    // console.log('diff: ' + diff);
    // console.log('tryy: ' + dueDate.unix());
    
    const statusButtonIcon = taskEl.find('.status button div').first();
    const dueBadgeSpan = taskEl.find('.due-badge span').first();

    taskEl.prop('id', taskData.id);
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

