declare var $: any;

const tasks = [];


function modalOpen() {
    console.log('clicked!')
}

function addNewTask() {
    console.log('adding new task...');
    const data = {
        label: 'task one',
        status: 'Not Done'
    };
    $.ajax({
        type: "POST",
        url: 'createaction',
        data: data,
        success: (data) => {
            console.log('New task added!');
        },
        error: (data, t, e) => {
            console.log('error');
            console.log(t);
            console.log(e);
        },
        dataType: 'json'
      });
}

function allTasks() {
    console.log('gettings tasks...');
    const container = $('#tasks');

    const req = $.ajax({
        type: "GET",
        url: 'showaction',
        error: (data, t, e) => {
            console.log('error');
            console.log(data);
            console.log(t);
            console.log(e);
        },
        dataType: 'json'
    });
    
    req.then((data: any) => {
        console.log('succsess!');

        const dict: {} = data.tasks;
        console.log(Object.keys(dict));
        container.html('');
        tasks.length = 0;

        Object.keys(dict).forEach((id, i, a) => {
            const task = dict[id];
            if (task) {
                tasks.push(task);
            }
        });

        paint();
        return data;
    });
}

function paint() {
    const container = $('#tasks');

    tasks.forEach((task, i, a) => {
        // const task = v;
        if (task && task.label) {
            const label = task.label;
            const newEl = $('<div class="container"><div class="row"><div></div><div class="label">' + label + '</div><div>Not Done</div></div></div>');
            container.append(newEl);
        }
    });
}

allTasks();