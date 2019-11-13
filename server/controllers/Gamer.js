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

const makeGamer = (req, res) => {
  if (!req.body.name || !req.body.recommend || !req.body.review) {
    return res.status(400).json({
      error: 'RAWR! Name, recommend, and review are required.',
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

module.exports.accountPage = accountPage;
module.exports.getGamers = getGamers;
module.exports.make = makeGamer;