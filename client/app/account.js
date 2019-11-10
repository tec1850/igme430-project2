const handleGamer = (e) => {
  e.preventDefault();
  
  $("#gamerMessage").animate({width:'hide'},350);
  
  if($("#gamerName").val() == '' || $("#gamerAge").val() == '' || $("#gamerLevel").val() == '') {
    handleError("RAWR! All fields required");
    return false;
  }
  
  sendAjax('POST', $("#gamerForm").attr("action"), $("#gamerForm").serialize(), function() {
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
        action="/account"
        method="POST"
        className="gamerForm"
      >
        <label htmlFor="name">Name: </label>
        <input id="gamerName" type="text" name="name" placeholder="Gamer Name"/>
        <label htmlFor="age">Age: </label>
        <input id="gamerAge" type="text" name="age" placeholder="Gamer Age"/>
        <label htmlFor="level">Level: </label>
        <input id="gamerLevel" type="text" name="level" placeholder="Gamer Level"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeGamerSubmit" type="submit" value="Make Gamer" />
      </form>
      
      
      <form id="gamerForm2"
        name="gamerForm2"
        onSubmit={deleteGamer}
        action="/delete"
        method="POST"
        className="gamerForm">

        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="deleteGamerSubmit" type="submit" value="Delete Gamer" />
      </form>
    </div>

  );
};

const GamerList = function(props) {
  if(props.gamers.length === 0) {
    return (
      <div className="gamerList">
        <h3 className="emptyGamer">No Gamers yet</h3>
      </div>
    );
  }
  
  const gamerNodes = props.gamers.map(function(gamer) {
    return(
      <div key={gamer._id} className="gamer">
        <img src="/assets/img/gamerface.jpeg" alt="gamer face" className="gamerFace" />
        <h3 className="gamerName"> Name: {gamer.name} </h3>
        <h3 className="gamerAge"> Age: {gamer.age} </h3>
        <h3 className="gamerLevel"> Level: {gamer.level} </h3>
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

const setup = function(csrf) {
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

$(document).ready(function(){
  getToken();
});

const CheckGamer = function(props)  {
  if(props.gamers.length === 0) {
    return true;
  }
  return false;
};

const deleteGamer = (e) => {
  e.preventDefault();
  
  $("#gamerMessage").animate({width:'hide'},350);
  
  if(CheckGamer) {
    handleError("RAWR! There are no gamers to delete!");
    return false;
  }
  
  sendAjax('POST', $("#gamerForm2").attr("action"), $("#gamerForm2").serialize(), function() {
    loadGamersFromServer();
  });
  
  return false;
};

