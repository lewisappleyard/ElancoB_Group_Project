$(document).ready(function (e) {

$("form#data").on('submit',(function(e) {
    e.preventDefault();
    $.ajax({
        url: "/api/sampleresponse",
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        beforeSend : function() {
        //$("#err").fadeOut();
        },
        success: function(data) {
            alert(JSON.stringify(data));
        },
        error: function(e) {
        alert(e);
        }                    
    });
}));

});