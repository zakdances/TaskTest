declare var $: any;
declare var moment: any;
declare var paint: (tasks: any[]) => void;
declare var arrayFromDBObjects: (dict: any) => any[];

const formModal = $('#form-modal');
const okButton = formModal.find('.modal-footer').find('.btn-primary');
const form = $('#task-form');


form.ajaxForm({
    dataType: 'json',
    success: (data) => {
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

const submitTaskForm = () => {
    console.log('adding task...');
    okButton.prop('disabled', true);
    form.submit();
    
    // form.ajaxSubmit();
}

const newDateWithAddedDays = (days: number) => {
    const d = new Date(); 

    let t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
 
    return d;
};


const datepicker = form.find('.datepicker');
datepicker.datepicker({
    autoclose: true
});

datepicker.datepicker('update', newDateWithAddedDays(7));
// datepicker.defaults.autoclose = true;
// function modalOpen() {
//     console.log('clicked!')
// }

