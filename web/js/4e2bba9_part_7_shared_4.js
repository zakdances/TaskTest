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
var arrayFromDBObjects = function (tasks) {
    var tasksDataType = $.type(tasks);
    var newArr = [];
    if (tasksDataType === 'string') {
        newArr = JSON.parse(tasks);
    }
    else if (tasksDataType !== 'array') {
        var arr_1 = [];
        var keys = Object.keys(tasks);
        keys.forEach(function (id, i, a) {
            var task = tasks[id];
            if (task) {
                arr_1.push(task);
            }
        });
        newArr = arr_1;
    }
    newArr.forEach(function (v, i, a) {
        var type = $.type(v.dueDate);
        if (type !== 'number') {
            // console.log('great');
            v.dueDate = v.dueDate.timestamp;
        }
    });
    return newArr;
};
var newDateWithAddedDays = function (days) {
    var d = new Date();
    var t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
    return d;
};
