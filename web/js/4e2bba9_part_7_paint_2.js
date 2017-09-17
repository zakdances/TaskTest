var paint = function (tasks) {
    var formModal = $('#form-modal');
    var simpleModal = $('#simple-modal');
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
            var dropdown = newTaskEl_1.find('.status .dropdown-menu').first();
            var actionIcons_1 = newTaskEl_1.find('.action-icons').first();
            var editButton = actionIcons_1.find('button.edit-button').first();
            var deleteButton = actionIcons_1.find('button.delete-button').first();
            var modalDeleteButton_1 = simpleModal.find('button.btn-danger').first();
            var modalTaskFormSaveButton = formModal.find('button.btn-primary').first();
            newTaskEl_1.bind('update', function () {
                updateTaskElementOnFrontEnd(newTaskEl_1, taskData);
            });
            newTaskEl_1.bind('updateOnBackEnd', function () {
                updateTaskElementOnBackEnd(newTaskEl_1, taskData);
            });
            newTaskEl_1.bind('delete', function () {
                updateTaskElementOnFrontEnd(newTaskEl_1, taskData, true);
                deleteTaskElementOnBackEnd(newTaskEl_1, taskData);
            });
            newTaskEl_1.hover(function () {
                actionIcons_1.toggleClass('invisible');
            });
            var modalCallbackName_1 = 'click.id_' + taskData.id;
            editButton.click(function () {
                formModal.data('task', taskData);
                formModal.modal('toggle');
                // modalTaskFormSaveButton.on(modalCallbackName, () => {
                //     // console.log('deleting a task...');
                //     newTaskEl.trigger('update');
                //     // simpleModal.modal('toggle');
                // });
            });
            deleteButton.click(function () {
                simpleModal.modal('toggle');
                modalDeleteButton_1.on(modalCallbackName_1, function () {
                    console.log('deleting a task...');
                    newTaskEl_1.trigger('delete');
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
                modalDeleteButton_1.off(modalCallbackName_1);
            });
            // Setup status change
            dropdown.children('a').each(function (i, el) {
                el = $(el);
                var val = Number(el.data('value'));
                el.click(function () {
                    taskData.status = val;
                    newTaskEl_1.trigger('update');
                    newTaskEl_1.trigger('updateOnBackEnd');
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
// TODO: Make sure to eliminate data from array if neccesary
var updateTaskElementOnFrontEnd = function (taskEl, taskData, deleteTask) {
    if (deleteTask === true) {
        taskEl.remove();
        return taskEl;
    }
    var now = moment();
    console.log('try: ' + taskData.dueDate);
    var dueDate = moment.unix(taskData.dueDate);
    console.log('try: ' + dueDate);
    var diff = dueDate.unix() - now.unix();
    var relativeTime = dueDate.fromNow();
    // console.log('diff: ' + diff);
    // console.log('tryy: ' + dueDate.unix());
    var statusButtonIcon = taskEl.find('.status button div').first();
    var dueBadgeSpan = taskEl.find('.due-badge span').first();
    taskEl.prop('id', taskData.id);
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
};
