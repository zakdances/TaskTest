declare var $: any;

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

var arrayFromDBObjects = (dict) => {
    const arr = [];
    const keys = Object.keys(dict);

    keys.forEach((id, i, a) => {
        const task = dict[id];
        if (task) {
            arr.push(task);
        }
    });
    return arr;
}

var newDateWithAddedDays = (days: number) => {
    const d = new Date(); 

    let t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
 
    return d;
}

