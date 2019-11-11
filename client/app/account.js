const handleGamer = (e) => {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerAge").val() == '' || $("#gamerLevel").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  sendAjax('POST', $("#gamerForm").attr("action"), $("#gamerForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

const GamerForm = (props) => {
  return (
    <div>
      <form id="gamerForm"
        name="gamerForm"
        onSubmit={handleGamer}
        action="/review"
        method="POST"
        className="gamerForm"
      >
        <label htmlFor="name">Game: </label>
        <input id="gamerName" type="text" name="name" placeholder="Game" />
        <label htmlFor="age">Recommend: </label>
        <input id="gamerAge" type="text" name="age" placeholder="Recommend" />
        <label htmlFor="level">Review: </label>
        <input id="gamerLevel" type="text" name="level" placeholder="Review" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeGamerSubmit" type="submit" value="Post Review" />
      </form>
    </div>
  );
};

const GamerList = function (props) {
  if (props.gamers.length === 0) {
    return (
      <div className="gamerList">
        <h3 className="emptyGamer">No reviews posted</h3>
      </div>
    );
  }

  const gamerNodes = props.gamers.map(function (gamer) {
    return (
      <div key={gamer._id} className="gamer">
        <img src="/assets/img/gamerface.jpeg" alt="gamer face" className="gamerFace" />
        <h3 className="gamerName"> Game: {gamer.name} </h3>
        <h3 className="gamerAge"> Recommend: {gamer.age} </h3>
        <h3 className="gamerLevel"> Review: {gamer.level} </h3>
      </div>
    );
  });

  return (
    <div classname="gamerList">
      {gamerNodes}
    </div>
  );
};

const loadGamersFromServer = () => {
  sendAjax('GET', '/getGamers', null, (data) => {
    ReactDOM.render(
      <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
    );
  });
};

const setup = function (csrf) {
  ReactDOM.render(
    <GamerForm csrf={csrf} />, document.querySelector("#makeGamer")
  );

  ReactDOM.render(
    <GamerList gamers={[]} />, document.querySelector("#gamers")
  );

  loadGamersFromServer();
};


const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});

const CheckGamer = function (props) {
  if (props.gamers.length === 0) {
    return true;
  }
  return false;
};
