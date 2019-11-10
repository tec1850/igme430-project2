const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requireSecure, controllers.Account.getToken);
  app.get('/getGamers', mid.requireLogin, controllers.Gamer.getGamers);
  app.get('/login', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requireLogout, controllers.Account.login);
  app.post('/signup', mid.requireSecure, mid.requireLogout, controllers.Account.signup);
  app.get('/logout', mid.requireLogin, controllers.Account.logout);
  app.get('/maker', mid.requireLogin, controllers.Gamer.makerPage);
  app.post('/maker', mid.requireLogin, controllers.Gamer.make);
  
  app.post('/delete', mid.requireLogin, controllers.Gamer.deleteGamer);
  
  app.get('/', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;
