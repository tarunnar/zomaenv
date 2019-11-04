
$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
function dosignup(){
    let email=$("#email_input").val();
    let mt =email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    if (mt==null){
        alert("submit valid email");
        return false;
    }
    let pass=$("#pass_input").val();
    let cpass=$("#cpass_input").val();
    if (pass=="" || cpass != pass){
        alert("password and confirm password are not same");
        return false;
    }
    var csrftoken = getCookie('csrftoken');
    console.log("csrftoken", csrftoken)
    $.ajax({
        method: "POST",
        crossDomain: true,
        url: "",
        dataType: "json",
        async: true,
        data: {
            'email': email,
            'pass': pass,
            "cpass": cpass,
            "csrfmiddlewaretoken" : csrftoken
        },
        headers: {
            "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
            'Accept': "appication/json"
        },
        success: function(response_data) {
            console.log("hi");
        },
        complete: function(data){
        },
        error: function() {
            infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
        }
    });
    return false;
}
function dologin(){
    let email=$("#email").val();
    let mt =email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    if (mt==null){
        alert("submit valid email");
        return false;
    }
    let pass=$("#password").val();
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        method: "POST",
        crossDomain: true,
        url: "",
        dataType: "json",
        async: true,
        data: {
            'email': email,
            'pass': pass,
            "csrfmiddlewaretoken" : csrftoken
        },
        headers: {
            "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
            'Accept': "appication/json"
        },
        success: function(response_data) {
            console.log(response_data);
            if(response_data.status == "login_succ"){
                window.location.href = window.location.href + response_data.redirect_url;
            }
            else{
                document.getElementById("login_failure").innerHTML = "Invalid Login Credentials"
            }
        },
        complete: function(data){
        },
        error: function() {
            console.log("ajax error");
        }
    });
    return false;
}

