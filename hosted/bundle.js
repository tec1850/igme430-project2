"use strict";

var handleGamer = function handleGamer(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerRecommend").val() == '' || $("#gamerReview").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('POST', $("#gamerForm").attr("action"), $("#gamerForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

var GamerForm = function GamerForm(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "gamerForm",
        name: "gamerForm",
        onSubmit: handleGamer,
        action: "/review",
        method: "POST",
        className: "gamerForm"
      },
      React.createElement("label", { htmlFor: "name" }),
      React.createElement("input", { id: "gamerName", type: "text", name: "name", placeholder: "Game" }),
      React.createElement(
        "label",
        { htmlFor: "recommend" },
        "Recommend: "
      ),
      React.createElement(
        "select",
        { id: "gamerRecommend", type: "select", name: "recommend" },
        React.createElement(
          "option",
          { value: "yes" },
          "Yes"
        ),
        React.createElement(
          "option",
          { value: "no" },
          "No"
        )
      ),
      React.createElement("label", { htmlFor: "review" }),
      React.createElement("input", { id: "gamerReview", type: "text", name: "review", placeholder: "Review" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makeGamerSubmit", type: "submit", value: "Post Review" })
    )
  );
};

var GamerList = function GamerList(props) {
  if (props.gamers.length === 0) {
    return React.createElement(
      "div",
      { className: "gamerList" },
      React.createElement(
        "h3",
        { className: "emptyGamer" },
        "No reviews posted"
      )
    );
  }

  var gamerNodes = props.gamers.map(function (gamer) {
    return React.createElement(
      "div",
      { key: gamer._id, className: "gamer" },
      React.createElement("img", { src: "/assets/img/gamerface.jpeg", alt: "gamer face", className: "gamerFace" }),
      React.createElement(
        "h3",
        { className: "gamerName" },
        " Game: ",
        gamer.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gamerRecommend" },
        " Recommend: ",
        gamer.recommend,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gamerReview" },
        " Review: ",
        gamer.review,
        " "
      )
    );
  });

  return React.createElement(
    "div",
    { classname: "gamerList" },
    gamerNodes
  );
};

var loadGamersFromServer = function loadGamersFromServer() {
  sendAjax('GET', '/getGamers', null, function (data) {
    ReactDOM.render(React.createElement(GamerList, { gamers: data.gamers }), document.querySelector("#gamers"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(GamerForm, { csrf: csrf }), document.querySelector("#makeGamer"));

  ReactDOM.render(React.createElement(GamerList, { gamers: [] }), document.querySelector("#gamers"));

  loadGamersFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});

var CheckGamer = function CheckGamer(props) {
  if (props.gamers.length === 0) {
    return true;
  }
  return false;
};
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
