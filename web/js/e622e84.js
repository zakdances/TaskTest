var tasks = [];
function addNewTask() {
    console.log('adding new task programatically...');
    var data = {
        label: 'task one',
        status: 'Not Done'
    };
    $.ajax({
        type: "POST",
        url: 'createaction',
        data: data,
        success: function (data) {
            console.log('New task added!');
        },
        error: function (data, t, e) {
            console.log('task add error');
            console.log(t);
            console.log(e);
        },
        dataType: 'json'
    });
}
function allTasks() {
    console.log('gettings tasks...');
    // const container = $('#tasks');
    var req = $.ajax({
        type: "GET",
        url: 'showaction',
        error: function (data, t, e) {
            console.log('error');
            console.log(data);
            console.log(t);
            console.log(e);
        },
        dataType: 'json'
    });
    req.then(function (data) {
        console.log('succsess!');
        var dict = data.tasks;
        // console.log(data);
        // container.html('');
        // tasks.length = 0;
        // Object.keys(dict).forEach((id, i, a) => {
        //     const task = dict[id];
        //     if (task) {
        //         tasks.push(task);
        //     }
        // });
        paint(arrayFromDBObjects(dict));
        return data;
    });
}
allTasks();

var paint = function (tasks) {
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
            var editButton = actionIcons_1.find('.edit-button').first();
            var deleteButton = actionIcons_1.find('.delete-button').first();
            newTaskEl_1.bind('update', function () {
                updateTaskElementOnFrontEnd(newTaskEl_1, taskData);
            });
            newTaskEl_1.bind('updateOnBackEnd', function () {
                updateTaskElementOnBackEnd(newTaskEl_1, taskData);
            });
            editButton.click(function () {
                $('#form-modal').modal('toggle');
            });
            deleteButton.click(function () {
                simpleModal.modal('toggle');
                simpleModal.find('button.btn-danger').click(function () {
                });
            });
            newTaskEl_1.hover(function () {
                actionIcons_1.toggleClass('invisible');
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

var deleteTaskElementOnBackEnd = function (taskEl, taskData) {
    // console.log('adding new task programatically...');
    // console.log(taskData);
    $.ajax({
        type: "POST",
        url: 'deleteaction',
        dataType: 'json',
        data: taskData,
        success: function (data) {
            console.log('Task deleted programatically!');
        },
        error: function (data, t, e) {
            console.log('task deleted error');
            console.log(t);
            console.log(e);
        }
    });
};
var updateTaskElementOnBackEnd = function (taskEl, taskData) {
    // console.log('adding new task programatically...');
    // console.log(taskData);
    $.ajax({
        type: "POST",
        url: 'createaction',
        dataType: 'json',
        data: taskData,
        success: function (data) {
            console.log('New task added programatically!');
        },
        error: function (data, t, e) {
            console.log('task add error');
            console.log(t);
            console.log(e);
        }
    });
};
var dateFromObjectId = function (objectId) {
    var substring = objectId.substring(0, 8);
    return new Date(parseInt(substring, 16) * 1000);
};
var arrayFromDBObjects = function (dict) {
    var arr = [];
    var keys = Object.keys(dict);
    keys.forEach(function (id, i, a) {
        var task = dict[id];
        if (task) {
            arr.push(task);
        }
    });
    return arr;
};
var newDateWithAddedDays = function (days) {
    var d = new Date();
    var t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
    return d;
};

var formModal = $('#form-modal');
var okButton = formModal.find('.modal-footer').find('.btn-primary');
var form = $('#task-form');
var labelInput = form.find('input[name="label"]').first();
var labelInputWarning = labelInput.siblings('.invalid-feedback').first();
formModal.on('shown.bs.modal', function () {
    labelInput.focus();
});
formModal.on('hidden.bs.modal', function () {
    labelInputWarning.css('opacity', 0);
});
form.ajaxForm({
    dataType: 'json',
    beforeSubmit: function (arr, $form, options) {
        var submit = false;
        // The array of form data takes the following form: 
        // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
        arr.forEach(function (v, i, a) {
            if (v.name == 'dueDate') {
                var dateInt = moment(v.value, 'MM-DD-YYYY').unix();
                v.value = JSON.stringify({ sec: dateInt });
            }
        });
        // Validate form
        if ($form[0].checkValidity() == false) {
            labelInputWarning.css('opacity', 1);
            labelInput.focus();
            okButton.prop('disabled', false);
        }
        else {
            submit = true;
            labelInputWarning.css('opacity', 0);
        }
        // return false to cancel submit                  
        return submit;
    },
    success: function (data) {
        console.log('Task add success:');
        // console.log(data.tasks);
        labelInput.clearFields();
        okButton.prop('disabled', false);
        formModal.modal('hide');
        paint(arrayFromDBObjects(data.tasks));
    }
});
// attach handler to form's submit event 
form.submit(function () {
    // console.log('Submitting form...');
    // return false to prevent normal browser submit and page navigation 
    return false;
});
var submitTaskForm = function () {
    console.log('adding task...');
    okButton.prop('disabled', true);
    form.submit();
    // form.ajaxSubmit();
};
// Initalize datepicker
var datepicker = form.find('.datepicker');
datepicker.datepicker({
    autoclose: true
});
datepicker.datepicker('update', newDateWithAddedDays(7));
// datepicker.defaults.autoclose = true;
// function modalOpen() {
//     console.log('clicked!')
// }
