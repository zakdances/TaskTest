var formModal = $('#form-modal');
var okButton = formModal.find('.modal-footer').find('.btn-primary');
var form = $('#task-form');
form.ajaxForm({
    dataType: 'json',
    success: function (data) {
        console.log('Task add success:');
        console.log(data.tasks);
        okButton.prop('disabled', false);
        formModal.modal('hide');
        paint(data.tasks);
    }
});
// attach handler to form's submit event 
form.submit(function () {
    console.log('Submitting form...');
    // return false to prevent normal browser submit and page navigation 
    return false;
});
var submitTaskForm = function () {
    console.log('adding task...');
    okButton.prop('disabled', true);
    form.submit();
    // form.ajaxSubmit();
};
var newDateWithAddedDays = function (days) {
    var d = new Date();
    var t = d.getTime();
    t = t + (days * 86400000);
    d.setTime(t);
    return d;
};
var datepicker = form.find('.datepicker');
datepicker.datepicker({
    autoclose: true
});
datepicker.datepicker('update', newDateWithAddedDays(7));
// datepicker.defaults.autoclose = true;
// function modalOpen() {
//     console.log('clicked!')
// }
