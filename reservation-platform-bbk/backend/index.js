import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://223.130.155.88:5174'],
  credentials: true
}));

// JSON 파싱 미들웨어
app.use(express.json());

// 회원가입 API
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, userType, businessInfo } = req.body;
    const connection = await pool.getConnection();

    // 이메일 중복 체크
    const [existingUsers] = await connection.query(
      'SELECT * FROM Users WHERE Email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보 저장
    const [result] = await connection.query(
      'INSERT INTO Users (Email, Password, UserType, BusinessInfo) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, userType, businessInfo || null]
    );

    connection.release();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: result.insertId, email, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      id: result.insertId,
      email,
      userType,
      token
    });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 로그인 API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await pool.getConnection();

    // 사용자 조회
    const [users] = await connection.query(
      'SELECT * FROM Users WHERE Email = ?',
      [email]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = users[0];

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.Password);

    if (!isValidPassword) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.UserID, email: user.Email, userType: user.UserType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      id: user.UserID,
      email: user.Email,
      userType: user.UserType,
      token
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 네이버 로그인 URL 생성
app.get('/api/auth/naver', (req, res) => {
  const state = Math.random().toString(36).substring(2);
  const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${state}`;
  res.json({ url: naverAuthURL });
});

// 네이버 로그인 콜백
app.get('/api/auth/naver/callback', async (req, res) => {
  const { code, state } = req.query;
  
  try {
    // 네이버 액세스 토큰 얻기
    const tokenResponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code,
        state
      }
    });

    const { access_token } = tokenResponse.data;

    // 네이버 사용자 정보 얻기
    const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { 
        Authorization: `Bearer ${access_token}`
      }
    });

    const naverUser = userResponse.data.response;
    
    // DB에서 사용자 찾기 또는 새로 생성
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM Users WHERE Email = ? AND Provider = "naver"',
      [naverUser.email]
    );

    let user;
    if (users.length === 0) {
      // 새 사용자 생성
      const [result] = await connection.query(
        'INSERT INTO Users (Email, Name, Provider, ProviderID) VALUES (?, ?, "naver", ?)',
        [naverUser.email, naverUser.name, naverUser.id]
      );
      user = {
        id: result.insertId,
        email: naverUser.email,
        name: naverUser.name,
        provider: 'naver'
      };
    } else {
      user = users[0];
    }

    connection.release();

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.UserID || user.id, email: user.Email || user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 프론트엔드로 리다이렉트
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('네이버 로그인 에러:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=naver_login_failed`);
  }
});

// 서버 시작
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});