// Mongoose help found often at https://mongoosejs.com/docs/

const models = require('../models');

const { GamePost, Account } = models;

// Create a new Game Post, requiring at leas a title and description. Checks if the
// user has posted more than one game and if so if they are a premium member (and thus
// able to post multiple games). If so, create a new Game post.
const makeGamePost = (req, res) => {
  if (!req.body.postTitle || !req.body.postDescription) {
    return res.status(400).json({ error: 'We require both a Post Title and Description for a Quest.' });
  }

  if (req.body.postRec === 'on') {
    req.body.postRec = true;
  } else {
    req.body.postRec = false;
  }

  const GamePostData = {
    title: req.body.postTitle,
    poster: req.session.account.username,
    description: req.body.postDescription,
    game: req.body.postGame,
    dateOfPlay: req.body.postDate,
    recurring: req.body.postRec,
  };

  // check if the user posting hasnt already posted a game,
  // and if so check if they are a premium member
  return Account.AccountModel.findByUsername(req.session.account.username, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'An Error has occurred in creating a post' });
    }

    if (account.numberOfPosts >= 1 && account.premiumMember === false) {
      return res.status(400).json({ error: 'You must be a premium member to post multiple Quests.' });
    }

    Account.AccountModel.findOneAndUpdate({ username: account.username },
      { $inc: { numberOfPosts: 1 } }, (error) => {
        if (error) console.log('ERROR IN POST INCREMENT');
      });

    const newGamePost = new GamePost.GamePostModel(GamePostData);

    const gamePostPromise = newGamePost.save();

    gamePostPromise.then(() => res.json({ redirect: '/board' }));

    gamePostPromise.catch((promiseErr) => {
      console.log(promiseErr);
      if (promiseErr.code === 11000) {
        return res.status(400).json({ error: 'This Quest Post Already Exists' });
      }

      return res.status(400).json({ error: 'An Error Occurred' });
    });

    return gamePostPromise;
  });
};

// Return all GamePosts in the database and render it to the app
const questBoard = (req, res) => {
  GamePost.GamePostModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), posts: docs });
  });
};

// Just get all posts and return in as json
const getPosts = (request, response) => {
  const res = response;

  return GamePost.GamePostModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred retrieving Game Posts.' });
    }

    return res.json({ posts: docs });
  });
};

module.exports.postQuest = makeGamePost;
module.exports.getPosts = getPosts;
module.exports.questBoardPage = questBoard;
