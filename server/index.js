const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const app = express();
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

// application/x-www-form-urlencoded
// 클라이언트에서 오는 정보를 서버에서 분석 해서 가져 옴
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
// json 형식을 분석 해서 가져옴
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
	console.log('/api/hello')
	res.send('HELLO WORLD');
})

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
}).then(() => console.log('MongoDB Connected...'))
  .catch((error) => console.error('mongodb error', error));

app.get('/', (req, res) => res.send('Hello World!!! 오늘은 4월 29일 입니다.').end());
app.post('/api/users/register', (req, res) => {
	// 회원 가입 할 때 필요한 정보들을 client에서 가져오면
	// 데이터베이스에 넣어준다.
	const user = new User(req.body);
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

app.post('/api/user/login', (req, res) => {
	console.log('/login parameter', req.body);

	// 1.  요청된 이메일을 데이터베이스에 있는지 찾는다.
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) console.log({ err: err.toString() });
		if(!user) res.json({loginSuccess: false, message: '제공된 이메일에 해당하는 유저가 없습니다.'})

		// 2.  요청된 이메일이 데이터 베이스에 있다면 비밀번호를 확인한다.
		if(user) {
			user.comparePassword(req.body.password, (err, isMatch) => {
				console.log(isMatch);
			if(!isMatch) return res.json ({ loginSuccess: false, message: '비밀번호가 틀렸습니다.'})

				// 3. 비밀번호 까지 맞다면 토큰을 생성하기.
			user.generateToken((err, user)=> {
				console.log('generateToken result', { err, user });
				if(err) return res.status(500).send(err);
				// 토큰을 저장하다. 어디에? 1. 쿠키 2. local storage 3. session storage
				res.cookie("auth", user.token)
				.status(200)
				.json({loginSuccess: true, userId: user.token, message: "로그인 되었습니다."})
			})


			// user.generateToken((err, user) => {
			//
			// })
			})
		}
	})
});
/**
 * role 1 관리자
 * role 2 특정 부서 관리자
 * role 0 일반 유저
 * role !== 0 관리
 */
app.get('/api/users/auth', auth, (req, res) => {
	// 여기까지 미들웨어를 통과해 왔다면
	// Authentication 맞다
	const {_id, email, name, lastname, role, image} = req.user
	res.status(200).json({
		_id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email,
		name,
		lastname,
		role,
		image
	})
});

app.get('/api/users/logout', auth, (req, res) => {
	User.findOneAndUpdate({
		_id: req.user._id
	}, { token: ''}, (err, user) => {
		if (err) return res.json({ success: false, err});
		return res.status(200).send({
			success: true
		})
	})
})

const port = 5000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
