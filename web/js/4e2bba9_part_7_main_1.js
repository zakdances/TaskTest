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
            console.log('allTasks error');
            console.log(data);
            console.log(t);
            console.log(e);
        },
        dataType: 'json'
    });
    req.then(function (data) {
        console.log('success!');
        data.tasks = arrayFromDBObjects(data.tasks);
        console.log(data);
        // const dict: {} = data.tasks;
        // console.log(data);
        // container.html('');
        // tasks.length = 0;
        // Object.keys(dict).forEach((id, i, a) => {
        //     const task = dict[id];
        //     if (task) {
        //         tasks.push(task);
        //     }
        // });
        paint(data.tasks);
        return data;
    });
}
allTasks();
