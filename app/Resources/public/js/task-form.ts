declare var $: any;
declare var moment: any;
declare var paint: (tasks: any[]) => void;
declare var arrayFromDBObjects: (dict: any) => any[];
declare var newDateWithAddedDays: (days: number) => Date;
// import { Task } from './task.model';

class Task {
    
    public id: string;

    public label: string;

    public dueDate: Date;

    public status: number;

    constructor() {
        
    }
}


const date = newDateWithAddedDays(7);

const formModal = $('#form-modal');
const okButton = formModal.find('.modal-footer').find('.btn-primary');
const form = $('#task-form');
const labelInput = form.find('input[name="label"]').first();
const labelInputWarning = labelInput.siblings('.invalid-feedback').first();
const datePicker = form.find('input.datepicker').first();
const statusSelect = form.find('select[name="status"]').first();
const statusSelectOptions = statusSelect.children('option');


formModal.on('show.bs.modal', () => {
    let taskDataToEdit = formModal.data('task');
    if (taskDataToEdit && taskDataToEdit !== '') {

        const task = new Task();

        formModal.data('task', task);
        task.id = taskDataToEdit.id;
        task.label = taskDataToEdit.label;
        task.dueDate = moment.unix(taskDataToEdit.dueDate).toDate();
        task.status = taskDataToEdit.status;
        // const $id = taskDataToEdit._id.$id;
        // const taskDueDate = moment.unix(taskDataToEdit.dueDate.sec);
        // const status = taskDataToEdit.status;

        labelInput.val(task.label);
        datePicker.datepicker('update', task.dueDate);
        statusSelectOptions.removeAttr('selected')
            .filter('[value=' + task.status + ']')
            .attr('selected', true)

    }
})

formModal.on('shown.bs.modal', function () {
    labelInput.focus();
})

// formModal.on('hide.bs.modal', function () {
    
// })

formModal.on('hidden.bs.modal', function () {
    const date = newDateWithAddedDays(7);
    const taskDataToEdit = formModal.data('task');
    
    labelInputWarning.css('opacity', 0);

    if (!taskDataToEdit || taskDataToEdit !== '') {
        formModal.removeData('task');
        datePicker.datepicker('update', date);
    }
})

form.ajaxForm({
    dataType: 'json',
    beforeSubmit: function (formData: any[], $form, options) { 
        let submit = false;
        const task: Task & string = formModal.data('task');
        // The array of form data takes the following form: 
        // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
        formData.forEach((v, i, a) => {
            if (v.name == 'dueDate') {
                const dateInt = moment(v.value, 'MM-DD-YYYY').unix();
                // v.value = JSON.stringify({ sec: dateInt });
                v.value = dateInt;
            }
        });

        
        if (task && task !== '') {
            
            formData.push({
                name: 'id',
                value: JSON.stringify(task.id)
            });
        }


        // Validate form
        if ($form[0].checkValidity() == false) {
            labelInputWarning.css('opacity', 1);
            labelInput.focus()
            okButton.prop('disabled', false);
        }
        else {
            submit = true;
            labelInputWarning.css('opacity', 0);
        }

        

        
        // return false to cancel submit                  
        return submit;
    },
    success: (data) => {
        console.log('Task add success!');
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

const submitTaskForm = () => {
    console.log('adding task...');
    okButton.prop('disabled', true);
    form.submit();
    
    // form.ajaxSubmit();
}


// Initalize datepicker

datePicker.datepicker({
    autoclose: true,
    todayHighlight: true
});

datePicker.datepicker('update', date);
// datepicker.defaults.autoclose = true;
// function modalOpen() {
//     console.log('clicked!')
// }

