var formModal = $('#form-modal');
var okButton = formModal.find('.modal-footer').find('.btn-primary');
var form = $('#task-form');
var labelInput = form.find('input[name="label"]').first();
var labelInputWarning = labelInput.siblings('.invalid-feedback').first();
var datePicker = form.find('input.datepicker').first();
var statusSelect = form.find('select[name="status"]').first();
var statusSelectOptions = statusSelect.children('option');
formModal.on('show.bs.modal', function () {
    var taskDataToEdit = formModal.data('task');
    if (taskDataToEdit && taskDataToEdit !== '') {
        // const $id = taskDataToEdit._id.$id;
        var label = taskDataToEdit.label;
        var taskDueDate = moment.unix(taskDataToEdit.dueDate.sec);
        var status_1 = taskDataToEdit.status;
        labelInput.val(label);
        datePicker.datepicker('update', taskDueDate.toDate());
    }
});
formModal.on('shown.bs.modal', function () {
    labelInput.focus();
});
// formModal.on('hide.bs.modal', function () {
// })
formModal.on('hidden.bs.modal', function () {
    var date = newDateWithAddedDays(7);
    var taskDataToEdit = formModal.data('task');
    labelInputWarning.css('opacity', 0);
    if (!taskDataToEdit || taskDataToEdit !== '') {
        formModal.removeData('task');
        datePicker.datepicker('update', date);
    }
});
form.ajaxForm({
    dataType: 'json',
    beforeSubmit: function (arr, $form, options) {
        var submit = false;
        // The array of form data takes the following form: 
        // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
        arr.forEach(function (v, i, a) {
            if (v.name == 'dueDate') {
                var dateInt = moment(v.value, 'MM-DD-YYYY').unix();
                v.value = JSON.stringify({ sec: dateInt });
            }
        });
        // Validate form
        if ($form[0].checkValidity() == false) {
            labelInputWarning.css('opacity', 1);
            labelInput.focus();
            okButton.prop('disabled', false);
        }
        else {
            submit = true;
            labelInputWarning.css('opacity', 0);
        }
        // return false to cancel submit                  
        return submit;
    },
    success: function (data) {
        console.log('Task add success:');
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
var submitTaskForm = function () {
    console.log('adding task...');
    okButton.prop('disabled', true);
    form.submit();
    // form.ajaxSubmit();
};
// Initalize datepicker
datePicker.datepicker({
    autoclose: true,
    todayHighlight: true
});
var date = newDateWithAddedDays(7);
datePicker.datepicker('update', date);
// datepicker.defaults.autoclose = true;
// function modalOpen() {
//     console.log('clicked!')
// }
