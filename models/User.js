const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  // 비밀번호를 암호한 시킨다.
  // 1. salt를 먼저 생성
  // 2. salt Rounds = 10;
  // 3. salt를 이용해서 암호화한다.

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) {
          console.log('hash error', error);
          return next(error);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
