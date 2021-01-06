"use strict";

//Handles sending the AJAX call for a new post
var handleNewPost = function handleNewPost(e) {
  e.preventDefault();
  hidePost();

  if ($("#postTitle").val() == '' || $("#postDescription").val() == "") {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
    loadPostsFromServer();
  });
  return false;
}; //Currently non functional, waiting for the future


var handleNewReply = function handleNewReply(e) {
  e.preventDefault();
  $("#errorDiv").animate({
    left: '-40%'
  }, 350);
  $("#makePost").animate({
    left: '150%'
  }, 350);
  $("#darkLayer").hide(400);

  if ($("#replyField").val() == "") {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#postReply").attr("action"), $("#postForm").serialize(), function () {
    displayPost();
  });
  return false;
}; //Handles the AJAX call for changing the users password


var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#errorDiv").animate({
    left: '-40%'
  }, 350);
  $("#makePost").animate({
    left: '150%'
  }, 350);
  $("#fullPost").animate({
    top: '150%'
  }, 350);
  $("#darkLayer").hide(400);

  if ($("#pass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields required");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("New passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
}; //Sets up the form for creating posts


var PostForm = function PostForm(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: "postForm",
    name: "postForm",
    onSubmit: handleNewPost,
    action: "/postGame",
    method: "POST",
    className: "postForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "postTitle"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "postTitle",
    type: "text",
    name: "postTitle",
    placeholder: "Post Title"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "postGame"
  }, "Game: "), /*#__PURE__*/React.createElement("input", {
    id: "postGame",
    type: "text",
    name: "postGame",
    placeholder: "What Game are you playing?"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "postRec"
  }, "Recurring Game? "), /*#__PURE__*/React.createElement("select", {
    id: "postRec",
    type: "select",
    name: "postRec"
  }, /*#__PURE__*/React.createElement("option", {
    value: "true"
  }, "Yes"), /*#__PURE__*/React.createElement("option", {
    value: "false"
  }, "No")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "postDescription"
  }, "Quest Description: "), /*#__PURE__*/React.createElement("textarea", {
    id: "postDescription",
    rows: "5",
    cols: "30",
    name: "postDescription",
    placeholder: "Post Description"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Make post"
  })), /*#__PURE__*/React.createElement("button", {
    id: "closePost",
    onClick: function onClick(e) {
      return hidePost();
    }
  }, "Close Post"));
}; //Sets up the data for viewing the full post


var FullPostData = function FullPostData(post) {
  return /*#__PURE__*/React.createElement("div", {
    id: "fullData"
  }, /*#__PURE__*/React.createElement("h2", null, "Game Title:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "fullTitle",
    value: post.post.title,
    readOnly: true
  }), /*#__PURE__*/React.createElement("h2", null, "Quest Giver:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "fullPoster",
    value: post.post.poster,
    readOnly: true
  }), /*#__PURE__*/React.createElement("h2", null, "When is the Game?"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    id: "fullDate",
    value: post.post.dateOfPlay,
    readOnly: true
  }), /*#__PURE__*/React.createElement("h2", null, "Is it a recurring game?"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "fullRec",
    value: post.post.recurring,
    readOnly: true
  }), /*#__PURE__*/React.createElement("h2", null, "Game Description"), /*#__PURE__*/React.createElement("textarea", {
    id: "fullDescription",
    rows: "5",
    cols: "30",
    defaultValue: post.post.description,
    readOnly: true
  }));
}; //Currently non functional, waiting for the future


var FullPostReplyField = function FullPostReplyField(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: "postReply",
    name: "postReply",
    onSubmit: handleNewReply,
    action: "/postReply",
    method: "POST",
    className: "postForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "thePostReply"
  }, "Reply: "), /*#__PURE__*/React.createElement("textarea", {
    id: "thePostReply",
    rows: "5",
    cols: "30",
    name: "thePostReply",
    placeholder: "Reply (Coming Soon)"
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Reply to Post"
  })), /*#__PURE__*/React.createElement("button", {
    id: "closePost",
    onClick: function onClick(e) {
      return hidePost();
    }
  }, "Close Post"));
}; //Sets up the change password form


var ChangePassWindow = function ChangePassWindow(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleChangePass,
    action: "/changePassword",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "Enter New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass2"
  }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "retype new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  })), /*#__PURE__*/React.createElement("button", {
    id: "closePost",
    onClick: function onClick(e) {
      return hidePost();
    }
  }, "Close Post"));
}; //create and setup the button that shows the post maker form


var MakerPageButton = function MakerPageButton() {
  return /*#__PURE__*/React.createElement("div", {
    id: "makerButtonDiv"
  }, /*#__PURE__*/React.createElement("button", {
    className: "uiButton",
    id: "makerButton",
    onClick: function onClick(e) {
      return ShowMaker();
    }
  }, "Post a Quest!"));
}; //create and setup the button that shows the change password form


var SetupChangePassButton = function SetupChangePassButton() {
  return /*#__PURE__*/React.createElement("div", {
    id: "makerButtonDiv"
  }, /*#__PURE__*/React.createElement("button", {
    className: "uiButton",
    id: "changePassButton",
    onClick: function onClick(e) {
      return ShowChangePass();
    }
  }, "Change Password"));
}; //set up the content of the questboard through all of the posts


var PostList = function PostList(props) {
  if (props.posts.length === 0) {
    //Change this to the image with No Groups Available when finished
    return /*#__PURE__*/React.createElement("div", {
      className: "postList"
    }, /*#__PURE__*/React.createElement("h3", null, "No Group Postings Yet Adventurer"));
  }

  var postNodes = props.posts.map(function (post) {
    return /*#__PURE__*/React.createElement("div", {
      className: "postNode",
      key: post._id,
      onClick: function onClick(e) {
        return displayPost(post);
      }
    }, /*#__PURE__*/React.createElement("h2", null, post.title), /*#__PURE__*/React.createElement("h4", null, "Posted by ", post.poster));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "posts"
  }, postNodes);
}; ////Currently non functional, waiting for the future


var AllReplies = function AllReplies(post) {
  var replies = post.post.map(function (replies) {
    return /*#__PURE__*/React.createElement("div", {
      className: "gameReply",
      key: replies.poster
    }, /*#__PURE__*/React.createElement("h3", null, replies.poster), /*#__PURE__*/React.createElement("p", null, replies.reply));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "allReplies"
  }, replies);
}; //Displays the full post modal and React sets its values


function displayPost(post) {
  $("#fullPost").animate({
    top: '20%'
  }, 350);
  ReactDOM.render( /*#__PURE__*/React.createElement(FullPostData, {
    post: post
  }), document.querySelector("#fullDetails"));
  ReactDOM.render( /*#__PURE__*/React.createElement(FullPostReplyField, null), document.querySelector("#fullReplyField")); // ReactDOM.render(
  //     <AllReplies post={post}/>, document.querySelector("#fullReplies")
  // );
} //Ajax call for getting game posts and rendering them to the questboard


var loadPostsFromServer = function loadPostsFromServer() {
  sendAjax('GET', '/getGamePosts', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
      posts: data.posts
    }), document.querySelector("#questBoard"));
  });
}; //animate and show the maker form


var ShowMaker = function ShowMaker() {
  $("#makePost").animate({
    left: '30%'
  }, 350);
  $("#darkLayer").show(400);
}; //animate and show the change password form


var ShowChangePass = function ShowChangePass() {
  console.log("IN CHANGE PASS SHOW");
  $("#changePassDiv").animate({
    left: '30%'
  }, 350);
  $("#darkLayer").show(400);
}; //Setup the initial REact values


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PostForm, {
    csrf: csrf
  }), document.querySelector("#makePost"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PostList, {
    posts: []
  }), document.querySelector("#questBoard"));
  ReactDOM.render( /*#__PURE__*/React.createElement(MakerPageButton, null), document.querySelector("#makerButton"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SetupChangePassButton, null), document.querySelector("#changePassButton"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ErrorModal, null), document.querySelector("#error"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, {
    csrf: csrf
  }), document.querySelector("#changePassDiv"));
  loadPostsFromServer();
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
