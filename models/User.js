const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
		maxlength: 500,
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
					next(error);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});


userSchema.methods.comparePassword = function(plainPassword, cb) {
	// plainPassword 12346 와 암호화 된 비밀번호와 맞는지 비교
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		return cb(null, isMatch)
	})
}

userSchema.methods.generateToken = function(cb) {
	const user = this;
	// jsonwebtoken을 이용해서 token 생성하기
	const token = jwt.sign(user._id.toHexString(), 'secretToken');
	user.token = token;
	user.save(function(err, user) {
		if(err) return cb(err);
		cb(null, user);
	})
	// user._id + 'secretToken' = token
}

userSchema.statics.findByToken = function(token, cb) {
	let user = this;
	// user._id= token  + '' ;
	// 토큰을 decode 한다.
	jwt.verify(token, 'secretToken', function (err,decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 다음에
		// 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
		user.findOne({
			"_id": decoded, token
		}, function (err, user) {
			if (err) return cb(err)
			return cb(null, user);
		})
	})
}

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
