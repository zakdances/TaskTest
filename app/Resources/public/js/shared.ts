declare var $: any;
declare var moment: any;

var deleteTaskElementOnBackEnd = (taskEl, taskData) => {
    // console.log('adding new task programatically...');
    // console.log(taskData);

    $.ajax({
        type: "POST",
        url: 'deleteaction',
        dataType: 'json',
        data: taskData,
        success: (data) => {
            console.log('Task deleted programatically!');
        },
        error: (data, t, e) => {
            console.log('task deleted error');
            console.log(t);
            console.log(e);
        }
      });
}

var updateTaskElementOnBackEnd = (taskEl, taskData) => {
    // console.log('adding new task programatically...');
    // console.log(taskData);

    $.ajax({
        type: "POST",
        url: 'createaction',
        dataType: 'json',
        data: taskData,
        success: (data) => {
            console.log('New task added programatically!');
        },
        error: (data, t, e) => {
            console.log('task add error');
            console.log(t);
            console.log(e);
        }
      });
}

var dateFromObjectId = (objectId: string) => {
    const substring = objectId.substring(0, 8);
    return new Date(parseInt(substring, 16) * 1000);
}

var arrayFromDBObjects = (tasks) : any[] => {
    const tasksDataType = $.type(tasks);
    let newArr = [];

    if (tasksDataType === 'string') {
        newArr = JSON.parse(tasks);
    } else if (tasksDataType !== 'array') {
        const arr = [];
        const keys = Object.keys(tasks);
    
        keys.forEach((id, i, a) => {
            const task = tasks[id];
            if (task) {
                arr.push(task);
            }
        });
        newArr = arr;
    }

    newArr.forEach((v,i,a) => {
        const type = $.type(v.dueDate);
        if (type !== 'number') {
            // console.log('great');
            v.dueDate = v.dueDate.timestamp;
        }
    });

    return newArr;
}

var newDateWithAddedDays = (days: number) => {
    const d = new Date(); 

    let t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
 
    return d;
}

