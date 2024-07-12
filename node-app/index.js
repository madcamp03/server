// node-app/index.js
const mysql = require('mysql2');
const http = require('http');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'pass',
  database: process.env.DB_NAME || 'mydb'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ', err);
    return;
  }
  console.log('MySQL에 성공적으로 연결되었습니다.');
});

connection.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) throw err;
  console.log('The solution is: ', results[0].solution);
  connection.end();
});

// 간단한 HTTP 서버 추가
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
