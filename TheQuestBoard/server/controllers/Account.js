// Mongoose help found often at https://mongoosejs.com/docs/

const models = require('../models');

const { Account } = models;

// serve the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// functionality to logout a user by removing the stored session
// cookie and redirecting to the main page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Functionality to login a user. Checks if the required fields
// (username and password) are supplied, then try to authenticate
// the user. If that passes, set the session account to the found one
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required Quest Giver.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong Username or Password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/board' });
  });
};

// Functionality to sign up a new user. Checks if the
// values sent in (username and passwords) are usable,
// then create a secure password and salt.
// After that passes, create a new Account and
// set it to the new data.
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/board' });
    });

    savePromise.catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already exists.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Upgrade the logged in account to premium, allowing them to post
// multiple quests
const upgradeToPremium = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findOneAndUpdate({ _id: req.session.account._id },
    { premiumMember: true }, (err) => {
      if (err) {
        return res.json({ error: 'An error has occurred' });
      }
      return res.redirect('/board');
    });
};

// Functionality to change the current user's password. Authenticates
// based on the current password and then changes it to the new one
// if it passes the check for being entered correctly
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.session.account.username}`;
  const pass = `${req.body.pass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!username || !pass || !newPass || !newPass2) {
    console.dir('Start of change error');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New Passwords do not match.' });
  }

  return Account.AccountModel.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong Username or Password' });
    }

    return Account.AccountModel.generateHash(newPass,
      (salt, hash) => {
        Account.AccountModel.findOneAndUpdate({ username: req.session.account.username },
          { $set: { salt, password: hash } }, (e, docs) => {
            if (e) {
              return res.json({ error: 'An error occurred in changing your password.' });
            }

            req.session.account = Account.AccountModel.toAPI(docs);

            return res.json({ redirect: '/board' });
          });
      });
  });
};

// get the csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfToken = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfToken);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.upgradeToPremium = upgradeToPremium;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
