"use strict";

//React component for the loginform used on the home page/login page
var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "UserName: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  }));
}; //REact component for the signup form for new users used at the signup page


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "UserName: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  }));
}; //Renders the loginwindow component into the login.handlebars at #content


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //Renders the signupwindow component into the login.handlebars at #content


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //Sets up the buttons that trigger between the components and sets up the error
//modal


var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(ErrorModal, null), document.querySelector("#error"));
  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

//Animate the error modal and set it's error message
var handleError = function handleError(message) {
  console.log("ERROR " + message);
  $("#errorMessage").text(message); //https://stackoverflow.com/questions/17863490/animate-css-display

  $("#darkLayer").show(400);
  $("#errorDiv").animate({
    left: '40%'
  }, 500);
}; //redirect page 


var redirect = function redirect(response) {
  $("#errorDiv").animate({
    left: '-50%'
  }, 500);
  window.location = response.redirect;
}; //AJAX request helper function


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
}; //Send the AJAX request for logging in.


var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#errorDiv").animate({
    left: '-50%'
  }, 500);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password isempty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; //Send the AJAX request for signing up


var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#errorDiv").animate({
    left: '-50%'
  }, 500);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; //Hide various animations


var hidePost = function hidePost() {
  //Animate help from w3schools https://www.w3schools.com/
  $("#errorDiv").animate({
    left: '-40%'
  }, 350);
  $("#makePost").animate({
    left: '150%'
  }, 350);
  $("#changePassDiv").animate({
    left: '150%'
  }, 350);
  $("#fullPost").animate({
    top: '150%'
  }, 350);
  $("#darkLayer").hide(400);
}; //Set up ErrorModal


var ErrorModal = function ErrorModal() {
  return /*#__PURE__*/React.createElement("div", {
    id: "errorDiv"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("span", {
    id: "errorMessage"
  })), /*#__PURE__*/React.createElement("button", {
    id: "closeError",
    onClick: function onClick(e) {
      return hidePost();
    }
  }, "Close Message"));
};
