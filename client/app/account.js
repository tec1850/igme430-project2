const handleGamer = (e) => {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerRecommend").val() == 0 || $("#gamerReview").val() == '') {
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
        <input id="gamerName" type="text" name="name" placeholder="Game Title" />

        <select id="gamerRecommend" type="select" name="recommend">
          <option value="0">Recommend</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <input id="gamerReview" type="text" name="review" placeholder="Review..." />
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
        <h3 className="gamerName"> {gamer.name} </h3>
        <h3 className="gamerRecommend"> Recommended: {gamer.recommend} </h3>
        <h3 className="gamerReview"> {gamer.review} </h3>
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
  let URL = window.location.href;
  URL = URL.substr(URL.length - 4);

  if (URL == "home") {
    sendAjax('GET', '/getRecentGamers', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
  } else {
    sendAjax('GET', '/getGamers', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
  }
};

const setup = function (csrf) {
  let URL = window.location.href;
  URL = URL.substr(URL.length - 7);

  if (URL == "account") {
    ReactDOM.render(
      <GamerForm csrf={csrf} />, document.querySelector("#makeGamer")
    );
  }

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
