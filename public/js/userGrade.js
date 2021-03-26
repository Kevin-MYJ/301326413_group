
var userName = $("#user-name").html().split(" ")[0];
var userinput = $("<input type='text'>").attr("name","user").val(userName).hide();
$("#back-form").append(userinput);