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

var dateFromObjectId = function (objectId) {
    var substring = objectId.substring(0, 8);
    return new Date(parseInt(substring, 16) * 1000);
};
var arrayFromDBObjects = function (dict) {
    var arr = [];
    var keys = Object.keys(dict);
    console.log('keys');
    console.log(keys.length);
    keys.forEach(function (id, i, a) {
        var task = dict[id];
        if (task) {
            arr.push(task);
        }
    });
    return arr;
};

var formModal = $('#form-modal');
var okButton = formModal.find('.modal-footer').find('.btn-primary');
var form = $('#task-form');
form.ajaxForm({
    dataType: 'json',
    success: function (data) {
        console.log('Task add success:');
        console.log(data.tasks);
        okButton.prop('disabled', false);
        formModal.modal('hide');
        paint(arrayFromDBObjects(data.tasks));
    }
});
// attach handler to form's submit event 
form.submit(function () {
    console.log('Submitting form...');
    // return false to prevent normal browser submit and page navigation 
    return false;
});
var submitTaskForm = function () {
    console.log('adding task...');
    okButton.prop('disabled', true);
    form.submit();
    // form.ajaxSubmit();
};
var newDateWithAddedDays = function (days) {
    var d = new Date();
    var t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
    return d;
};
var datepicker = form.find('.datepicker');
datepicker.datepicker({
    autoclose: true
});
datepicker.datepicker('update', newDateWithAddedDays(7));
// datepicker.defaults.autoclose = true;
// function modalOpen() {
//     console.log('clicked!')
// }
