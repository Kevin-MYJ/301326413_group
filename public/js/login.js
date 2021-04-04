var toggleBtns = document.querySelectorAll('.js-formToggle');
for(var i = 0; i < toggleBtns.length; i++){
    toggleBtns[i].addEventListener("click",toggleForm);
}


var firstClick = true;

function toggleForm(){

    if(!firstClick){
        document.querySelector('.js-imageAnimate').classList.toggle("animate");
        document.querySelector('.js-imageAnimate').classList.toggle("animateOut");


        document.querySelector('.js-panel_content').classList.toggle("animate");
        document.querySelector('.js-panel_content').classList.toggle("animateOut");
    }
    else{
        firstClick = false;
        document.querySelector('.js-imageAnimate').classList.add("animate");
        document.querySelector('.js-panel_content').classList.add("animate");

    }

}

function checkRepeat(){
    var pw = $("#password").val();
    var repw = $("#Confirmpassword").val();
    if (pw != repw) {
        $("button#signup").attr("disabled", "true");
        $("#Confirmpassword").css({"border":"1px solid red"});
    }else{
        $("button#signup").removeAttr("disabled");
        $("#Confirmpassword").css({ "border": "none" });
    }
}

function checkEmail() {
    var obj = $("#em").val();
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i; //邮箱验证
    if(!reg.test(obj)){
        $("button#signup").attr("disabled", "true");
        $("#em").css({ "border": "1px solid red" });
    }else{
        $("button#signup").removeAttr("disabled");
        $("#em").css({ "border": "none" });
    }
}

function onSignIn2(googleUser){
		var profile = googleUser.getBasicProfile();
		console.log('User is ' + JSON.stringify(profile))

		var element = document.querySelector('#content')
		//element.innerText = profile.getName();

		console.log('ID: ' + profile.getId());
		console.log('Name: ' + profile.getName());
		console.log('Email: ' + profile.getEmail());
	}
