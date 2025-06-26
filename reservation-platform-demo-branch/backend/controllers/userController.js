const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

exports.signup = async (req, res) => {
  try {
    const { email, password, userName, userType, phone, companyName } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, RESPONSE_CODES.ERROR.RESOURCE_ALREADY_EXISTS,
        'Email already exists',
        '이미 존재하는 이메일입니다');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      userName,
      userType,
      phone,
      companyName
    });

    // 토큰 생성
    const token = jwt.sign(
      { id: newUser.id, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.USER_REGISTER,
      'User registration completed successfully',
      '회원가입이 완료되었습니다',
      {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          userName: newUser.userName,
          userType: newUser.userType
        }
      });
  } catch (error) {
    console.error('회원가입 에러:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to register user',
      '회원가입 중 오류가 발생했습니다',
      error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendError(res, 401, RESPONSE_CODES.ERROR.INVALID_CREDENTIALS,
        'Invalid email or password',
        '이메일 또는 비밀번호가 올바르지 않습니다');
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.USER_LOGIN,
      'User login successful',
      '로그인이 성공했습니다',
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          userType: user.userType
        }
      });
  } catch (error) {
    console.error('로그인 에러:', error);
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to login',
      '로그인 중 오류가 발생했습니다',
      error.message);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return commonErrors.notFound(res, 'User not found', '사용자를 찾을 수 없습니다');
    }
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.USER_PROFILE_GET,
      'User profile retrieved successfully',
      '사용자 프로필을 성공적으로 조회했습니다',
      user);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve user profile',
      '사용자 프로필 조회 중 오류가 발생했습니다',
      err.message);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.USER_PROFILE_UPDATE,
      'User profile updated successfully',
      '사용자 프로필이 성공적으로 업데이트되었습니다',
      user);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to update user profile',
      '사용자 프로필 업데이트 중 오류가 발생했습니다',
      err.message);
  }
};

exports.getNotificationSettings = async (req, res, next) => {
  try {
    const settings = await userService.getNotificationSettings(req.user.id);
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
      'Notification settings retrieved successfully',
      '알림 설정을 성공적으로 조회했습니다',
      settings);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to retrieve notification settings',
      '알림 설정 조회 중 오류가 발생했습니다',
      err.message);
  }
};

exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const settings = await userService.updateNotificationSettings(req.user.id, req.body);
    sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.OPERATION_COMPLETED,
      'Notification settings updated successfully',
      '알림 설정이 업데이트되었습니다',
      settings);
  } catch (err) {
    sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
      'Failed to update notification settings',
      '알림 설정 업데이트 중 오류가 발생했습니다',
      err.message);
  }
};