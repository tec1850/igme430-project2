const handleGamer = (e) => {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerRecommend").val() == 0 || $("#gamerReview").val() == '') {
    handleError("All fields are required.");
    return false;
  }
  else if (document.querySelectorAll('.gamer').length >= 6) {
    handleError("Upgrade to premium to continue posting.");
    return false;
  }

  sendAjax('POST', $("#gamerForm").attr("action"), $("#gamerForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

const handleSearch = (e) => {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '') {
    handleError("Please enter a game title to search.");
    return false;
  }

  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function () {
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

        <textarea id="gamerReview" type="text" name="review" rows="5" cols="50"  placeholder="Review..." />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeGamerSubmit" type="submit" value="Post Review" />
      </form>
    </div>
  );
};

const SearchForm = (props) => {
  return (
    <div>
      <form id="searchForm"
        name="searchForm"
        onSubmit={handleSearch}
        action="/getReviews"
        method="POST"
        className="searchForm"
      >
        <input id="gamerName" type="text" name="name" placeholder="Game Title" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="searchGamerSubmit" type="submit" value="Search" />
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
  } else if (URL == "ount") {
    sendAjax('GET', '/getGamers', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
  } else if (URL == "arch") {
    sendAjax('GET', '/getReviews', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
  }
};

const setup = function (csrf) {
  let URL = window.location.href;
  URL = URL.substr(URL.length - 4);

  if (URL == "ount") {
    ReactDOM.render(
      <GamerForm csrf={csrf} />, document.querySelector("#makeGamer")
    );
    loadGamersFromServer();
  }

  if (URL == "arch") {
    ReactDOM.render(
      <SearchForm csrf={csrf} />, document.querySelector("#searchGamer")
    );
    loadGamersFromServer();
  }

  if (URL == "ount" || URL == "home" || URL == "arch") {
    ReactDOM.render(
      <GamerList gamers={[]} />, document.querySelector("#gamers")
    );
    loadGamersFromServer();
  }
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

const CheckGamer = function (props) {
  if (props.gamers.length === 0) {
    return true;
  }
  return false;
};

$(document).ready(function () {
  getToken();
});