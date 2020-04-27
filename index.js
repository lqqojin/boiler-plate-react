const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const { Users } = require('./models/Users');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://192.168.0.17:27017', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
}).then(() => console.log('MongoDB Connected...'))
  .catch((error) => console.error('mongodb error', error));

app.get('/', (req, res) => res.send('Hello World!!! 오늘은 4월 29일 입니다.'));
app.post('/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 데이터베이스에 넣어준다.
  const user = new Users(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    console.log(userInfo);
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
