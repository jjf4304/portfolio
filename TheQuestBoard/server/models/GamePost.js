const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

// Mongoose help found often at https://mongoosejs.com/docs/

let GamePostModel = {};

const convertID = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();
const setDesc = (desc) => _.escape(desc).trim();
const setPoster = (poster) => _.escape(poster).trim();
const setGame = (game) => _.escape(game).trim();

// Gamepost Schema. Like the Account Schema, there are
// some things that are not currently used until I can implement them
// after the semester.
const GamePostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  poster: {
    type: String,
    required: true,
    trim: true,
    set: setPoster,
  },
  replies: [{
    poster: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
  }],
  game: {
    type: String,
    required: true,
    trim: true,
    set: setGame,
  },
  dateOfPlay: {
    type: Date,
    required: false, // need to change this when dates work
  },
  recurring: {
    type: Boolean,
    required: false,
    default: false,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    set: setDesc,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

GamePostSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  poster: doc.poster,
  replies: doc.replies,
  game: doc.game,
  dateOfPlay: doc.dateOfPlay,
  recurring: doc.recurring,
  description: doc.description,
  createdDate: doc.createdDate,
  _id: doc._id,
});

// Be able to find a game by it's poster. Will be more useful later
GamePostSchema.statics.findByPoster = (accountId, callback) => {
  const search = {
    poster: convertID(accountId),
  };

  return GamePostModel.find(search).select('title poster description createdDate').lean().exec(callback);
};

// Find all game posts
GamePostSchema.statics.findAllPosts = (callback) => GamePostModel.find({}).select('title poster description createdDate').lean().exec(callback);

GamePostModel = mongoose.model('GamePost', GamePostSchema);

module.exports.GamePostModel = GamePostModel;
module.exports.GamePostSchema = GamePostSchema;
