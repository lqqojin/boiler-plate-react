const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const app = express();
const port = 3000;
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
}).then(() => console.log('MongoDB Connected...'))
  .catch((error) => console.error('mongodb error', error));

app.get('/', (req, res) => res.send('Hello World!!! 오늘은 4월 29일 입니다.').end());
app.post('/register', (req, res) => {
	// 회원 가입 할 때 필요한 정보들을 client에서 가져오면
	// 데이터베이스에 넣어준다.
	const user = new User(req.body);
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

app.post('/login', (req, res) => {
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
				res.cookie("x_auth", user.token)
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
