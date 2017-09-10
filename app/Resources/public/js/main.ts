declare var $: any;
declare var moment: any;
declare var dateFromObjectId: (objectId: string) => Date;
declare var paint: (tasks: any[]) => void;
declare var arrayFromDBObjects: (dict: any) => any[];

const tasks = [];


    
function addNewTask() {
    console.log('adding new task programatically...');
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