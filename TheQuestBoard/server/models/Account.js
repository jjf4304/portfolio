const crypto = require('crypto');
const mongoose = require('mongoose');

// Mongoose help found often at https://mongoosejs.com/docs/

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

// The Account Schema. Some values are not currently used
// as they are things I didn't get to work on but want to in
// the future.
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  notifications: {
    type: Boolean,
    required: false,
    default: false,
  },
  premiumMember: {
    type: Boolean,
    required: false,
    default: false,
  },
  posts: [{
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: 'GamePosts',
  }],
  numberOfPosts: {
    type: Number,
    required: false,
    default: 0,
    min: 0,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// functionality to return the following data for use in session
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  premiumMember: doc.premiumMember,
  _id: doc._id,
});

// Validates the given password, checking if the hashed password equals
// the password sent in then continue to the next callback function
const validatePass = (doc, password, callback) => {
  const pass = doc.password;
  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// Functionality to find an account by it's username
AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

// Generates a salt and hash for a password, used in account creation and password changing
AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

// Functionality to check if a username and password pairs up to an acocunt
AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePass(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }
      return callback();
    });
  });
};

// Functionality to find a user in order to get them to become premium
AccountSchema.statics.becomePremium = (username, callback) => {
  AccountModel.findByUsername(username, (err, account) => {
    if (err) {
      return callback(err);
    }

    if (!account) {
      return callback();
    }

    return callback(account);
  });
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
