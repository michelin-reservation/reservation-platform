const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

// JWT 토큰 생성
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, role, company } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, RESPONSE_CODES.ERROR.RESOURCE_ALREADY_EXISTS,
        'Email already registered',
        '이미 가입된 이메일입니다');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      company
    });

    // 토큰 생성
    const token = generateToken(user);

    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.USER_REGISTER,
      'User registration completed successfully',
      '회원가입이 완료되었습니다',
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to register user',
      '회원가입 중 오류가 발생했습니다',
      error.message);
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 401, RESPONSE_CODES.ERROR.INVALID_CREDENTIALS,
        'Invalid email or password',
        '이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, RESPONSE_CODES.ERROR.INVALID_CREDENTIALS,
        'Invalid email or password',
        '이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // 토큰 생성
    const token = generateToken(user);

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.USER_LOGIN,
      'User login successful',
      '로그인이 성공했습니다',
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to login',
      '로그인 중 오류가 발생했습니다',
      error.message);
  }
};

// 현재 사용자 정보 조회
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return commonErrors.notFound(res, 'User not found', '사용자를 찾을 수 없습니다');
    }

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.USER_PROFILE_GET,
      'Current user information retrieved successfully',
      '현재 사용자 정보를 성공적으로 조회했습니다',
      user);
  } catch (error) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve current user',
      '사용자 정보 조회 중 오류가 발생했습니다',
      error.message);
  }
};