console.log('hello thhereee');
function modalOpen() {
    console.log('clicked!');
}
function addNewTask() {
    console.log('adding new task...');
    var data = {
        label: 'task one',
        status: 'new'
    };
    $.ajax({
        type: "POST",
        url: 'addtask',
        data: data,
        success: function () {
            console.log('succccsess!');
        },
        dataType: 'json'
    });
}
