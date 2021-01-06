//Animate the error modal and set it's error message
const handleError = (message) =>{
    console.log("ERROR " + message);
    $("#errorMessage").text(message);
    //https://stackoverflow.com/questions/17863490/animate-css-display
    $("#darkLayer").show(400);
    $("#errorDiv").animate({left: '40%'}, 500);

};

//redirect page 
const redirect = (response) =>{
    $("#errorDiv").animate({left: '-50%'}, 500);
    window.location = response.redirect;
};

//AJAX request helper function
const sendAjax = (type, action, data, success) =>{
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr,status,error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

//Send the AJAX request for logging in.
const handleLogin = (e) =>{
    e.preventDefault();

    $("#errorDiv").animate({left: '-50%'}, 500);

    if($("#user").val() == ''||$("#pass").val()==''){
        handleError("Username or password isempty");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(),redirect);

    return false;
};

//Send the AJAX request for signing up
const handleSignup = (e) =>{
    e.preventDefault();

    $("#errorDiv").animate({left: '-50%'}, 500);

    if($("#user").val() == ''||$("#pass").val()==''|| $("#pass2").val()==''){
        handleError("All fields required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

//Hide various animations
const hidePost = () =>{
    //Animate help from w3schools https://www.w3schools.com/
    $("#errorDiv").animate({left: '-40%'}, 350);
    $("#makePost").animate({left: '150%'}, 350);
    $("#changePassDiv").animate({left: '150%'}, 350);
    $("#fullPost").animate({top: '150%'}, 350);
    $("#darkLayer").hide(400);
};

//Set up ErrorModal
const ErrorModal = function(){

    return(
        <div id="errorDiv">
            <h3><span id="errorMessage"></span></h3>
            <button id="closeError" onClick={e =>hidePost()}>Close Message</button>
        </div>
    );

};