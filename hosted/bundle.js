"use strict";

var handleGamer = function handleGamer(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerAge").val() == '' || $("#gamerLevel").val() == '') {
    handleError("RAWR! All fields required");
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
        action: "/maker",
        method: "POST",
        className: "gamerForm"
      },
      React.createElement(
        "label",
        { htmlFor: "name" },
        "Name: "
      ),
      React.createElement("input", { id: "gamerName", type: "text", name: "name", placeholder: "Gamer Name" }),
      React.createElement(
        "label",
        { htmlFor: "age" },
        "Age: "
      ),
      React.createElement("input", { id: "gamerAge", type: "text", name: "age", placeholder: "Gamer Age" }),
      React.createElement(
        "label",
        { htmlFor: "level" },
        "Level: "
      ),
      React.createElement("input", { id: "gamerLevel", type: "text", name: "level", placeholder: "Gamer Level" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makeGamerSubmit", type: "submit", value: "Make Gamer" })
    ),
    React.createElement(
      "form",
      { id: "gamerForm2",
        name: "gamerForm2",
        onSubmit: deleteGamer,
        action: "/delete",
        method: "POST",
        className: "gamerForm" },
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "deleteGamerSubmit", type: "submit", value: "Delete Gamer" })
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
        "No Gamers yet"
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
        " Name: ",
        gamer.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gamerAge" },
        " Age: ",
        gamer.age,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gamerLevel" },
        " Level: ",
        gamer.level,
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

var deleteGamer = function deleteGamer(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if (CheckGamer) {
    handleError("RAWR! There are no gamers to delete!");
    return false;
  }

  sendAjax('POST', $("#gamerForm2").attr("action"), $("#gamerForm2").serialize(), function () {
    loadGamersFromServer();
  });

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
