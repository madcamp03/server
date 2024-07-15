require('dotenv').config();
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./database/db'); // Adjust the path according to your project structure
//const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// 제발 고쳐저라
//auth(passport); // sets button click functionalities

// 초기화 실행
initializeDatabase();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

// API Endpoints
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ? AND user_password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        user_id: user.user_id,
        user_name: user.user_name,
        real_name: user.real_name,
        user_role: user.user_role,
        team_id: user.team_id,
        created_at: user.created_at
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // 라우트 설정
// const gitcatRouter = require('./routes/gitcatRouter');
// app.use('/gitcat', gitcatRouter); // Using repoRouter

// // 기본 라우트
// app.get('/', (req, res) => {
//   res.send('<h1>Welcome to GitCat</h1><a href="/auth/github">Login with GitHub</a>');
// });


// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/' }),
//   (req, res) => {
//     const gitcatSecret = process.env.GITCAT_SECRET;
//     const userId = req.user.id; // Ensure userId is available from req.user
//     console.log('redirecting.!!!');
//     res.redirect('gitcat://loginsuccess?user_id='+userId+'&gitcat_secret='+gitcatSecret);
//   },
//   (err, req, res, next) => {
//     console.error('Error during GitHub authentication', err);
//     res.redirect('/');
//   }
// );

// app.get('/profile', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send(`<h1>Profile</h1><p>Welcome ${req.user.username}</p>`);
//   } else {
//     res.redirect('/');
//   }
// });

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});