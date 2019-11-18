const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requireSecure, controllers.Account.getToken);
  app.get('/getGamers', mid.requireLogin, controllers.Gamer.getGamers);
  app.get('/login', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requireLogout, controllers.Account.login);
  app.post('/signup', mid.requireSecure, mid.requireLogout, controllers.Account.signup);
  app.get('/logout', mid.requireLogin, controllers.Account.logout);
  app.get('/account', mid.requireLogin, controllers.Gamer.accountPage);
  app.post('/review', mid.requireLogin, controllers.Gamer.make);
  app.get('/home', mid.requireLogin, controllers.Gamer.homePage);
  app.get('/searchTitle', mid.requireLogin, controllers.Gamer.searchTitle);
  app.post('/searchTitle', mid.requireLogin, controllers.Gamer.searchTitle);
  app.get('/search', mid.requireLogin, controllers.Gamer.searchPage);
  app.get('/getRecentGamers', mid.requireLogin, controllers.Gamer.getRecentGamers);

  app.get('/', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;
