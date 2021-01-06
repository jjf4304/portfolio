const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/board', mid.requiresLogin, controllers.GamePost.questBoardPage);
  app.post('/postGame', mid.requiresLogin, controllers.GamePost.postQuest);
  app.post('/postReply', mid.requiresLogin, controllers.GamePost.postQuest);
  app.get('/becomePremium', mid.requiresLogin, controllers.Account.upgradeToPremium);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getGamePosts', mid.requiresLogin, controllers.GamePost.getPosts);

  // Catch 404?
  app.use((req, res) => {
    res.status(404);
    res.redirect('/board');
  });
};

module.exports = router;
