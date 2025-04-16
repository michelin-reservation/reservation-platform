const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { email, password, userName, userType, phone, companyName } = req.body;
    
    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const newUser = new User({
      email,
      password,
      userName,
      userType,
      phone,
      companyName
    });

    await newUser.save();

    // 토큰 생성
    const token = jwt.sign(
      { id: newUser._id, userType: newUser.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: newUser._id,
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
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
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

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 