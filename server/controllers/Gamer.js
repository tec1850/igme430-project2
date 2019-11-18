const models = require('../models');
const Gamer = models.Gamer;

const accountPage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }

    return res.render('app', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const homePage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }

    return res.render('home', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const searchPage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }

    return res.render('search', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const makeGamer = (req, res) => {
  if (!req.body.name || !req.body.recommend || !req.body.review) {
    return res.status(400).json({
      error: 'Hey! Game title, recommend, and review are required.',
    });
  }

  const gamerData = {
    name: req.body.name,
    recommend: req.body.recommend,
    review: req.body.review,
    owner: req.session.account._id,
  };

  const newGamer = new Gamer.GamerModel(gamerData);

  const gamerPromise = newGamer.save();

  gamerPromise.then(() => res.json({
    redirect: '/account',
  }));

  gamerPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Gamer already exists.',
      });
    }

    return res.status(400).json({
      error: 'An error occurred.',
    });
  });

  return gamerPromise;
};

const searchGamer = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'Hey! Game title is required.',
    });
  }

  Gamer.GamerModel.findByName(req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }

    return res.json({ gamers: docs });
  });

};

const getGamers = (request, response) => {
  const req = request;
  const res = response;

  return Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ gamers: docs });
  });
};

const getRecentGamers = (request, response) => {
  const req = request;
  const res = response;

  return Gamer.GamerModel.findRecent((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ gamers: docs });
  });
};




const changePassword = (request, response) => {
  console.log("hi");
  const req = request;
  const res = response;

  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'RAWR! All fields are required!',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'RAWR! Passwords do not match!',
    });
  }
  
  return Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    if (err) {
      return res.json({error: err})
    }
    
    
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const accountData = {
        username: req.body.username,
        salt,
        password: hash,
      };

      const savePromise = Account.AccountModel(accountData).save();

      savePromise.then(() => {
        res.json({
          redirect: '/account',
        });
      });
    });
  });
  
  
};


module.exports.accountPage = accountPage;
module.exports.getGamers = getGamers;
module.exports.getRecentGamers = getRecentGamers;
module.exports.make = makeGamer;
module.exports.homePage = homePage;
module.exports.searchPage = searchPage;
module.exports.searchTitle = searchGamer;

module.exports.changePassword = changePassword;
