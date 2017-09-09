var tasks = [];
function modalOpen() {
    console.log('clicked!');
}
function addNewTask() {
    console.log('adding new task...');
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
            console.log('error');
            console.log(t);
            console.log(e);
        },
        dataType: 'json'
    });
}
function allTasks() {
    console.log('gettings tasks...');
    var container = $('#tasks');
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
        console.log(Object.keys(dict));
        container.html('');
        tasks.length = 0;
        Object.keys(dict).forEach(function (id, i, a) {
            var task = dict[id];
            if (task) {
                tasks.push(task);
            }
        });
        paint();
        return data;
    });
}
function paint() {
    var container = $('#tasks');
    tasks.forEach(function (task, i, a) {
        // const task = v;
        if (task && task.label) {
            var label = task.label;
            var newEl = $('<div class="container"><div class="row"><div></div><div class="label">' + label + '</div><div>Not Done</div></div></div>');
            container.append(newEl);
        }
    });
}
allTasks();
