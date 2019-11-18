"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty.");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords don't match.");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "form",
    { id: "loginForm", name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign In" })
  );
};

var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "form",
    { id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

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

  passChange.addEventListener("click", function (e) {
    e.preventDefault();
    createChangeWindow(csrf);
    return false;
  });

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

//const handleChange = (e) => {
//  e.preventDefault();
//
//  $("#gamerMessage").animate({ width: 'hide' }, 350);
//
//  if ($("#pass").val() == '' || $("#pass2").val() == '') {
//    handleError("All fields are required.");
//    return false;
//  }
//
//  if ($("#pass").val() !== $("#pass2").val()) {
//    handleError("Passwords don't match.");
//    return false;
//  }
//
//  sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
//
//  return false;
//};
//
//const changeWindow = (props) => {
//  return (
//    <form id="changeForm"
//      name="changeForm"
//      onSubmit={handleSignup}
//      action="/change"
//      method="POST"
//      className="mainForm"
//    >
//      <label htmlFor="pass">Password: </label>
//      <input id="pass" type="password" name="pass" placeholder="password" />
//      <label htmlFor="pass2">Password: </label>
//      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
//      
//      <input type="hidden" name="_csrf" value={props.csrf} />
//      <input className="formSubmit" type="submit" value="Confirm Change" />
//    </form>
//  );
//};
//
//const createChangeWindow = (csrf) => {
//  ReactDOM.render(
//    <ChangeWindow csrf={csrf} />,
//    document.querySelector("#content")
//  );
//};
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#gamerMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#gamerMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

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
};
