const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

exports.signup = async (req, res) => {
  try {
    const { email, password, userName, userType, phone, companyName } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
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

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
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
    res.status(500).json({
      success: false,
      message: error.message || '회원가입 중 오류가 발생했습니다.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
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
    res.status(500).json({
      success: false,
      message: error.message || '로그인 중 오류가 발생했습니다.'
    });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ code: 'NOT_FOUND', message: '사용자를 찾을 수 없습니다.' });
    res.json({ code: 'SUCCESS', data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    res.json({ code: 'SUCCESS', data: user });
  } catch (err) {
    next(err);
  }
};

exports.getNotificationSettings = async (req, res, next) => {
  try {
    const settings = await userService.getNotificationSettings(req.user.id);
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const settings = await userService.updateNotificationSettings(req.user.id, req.body);
    res.json({ message: '알림 설정이 업데이트되었습니다.', settings });
  } catch (err) {
    next(err);
  }
};