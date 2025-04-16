const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름을 입력해주세요.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '올바른 이메일 형식을 입력해주세요.']
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요.'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.'],
    select: false
  },
  phone: {
    type: String,
    required: [true, '전화번호를 입력해주세요.'],
    match: [/^[0-9]{10,11}$/, '올바른 전화번호 형식을 입력해주세요.']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'vip', 'admin'],
      message: '유효하지 않은 회원 유형입니다. (user/vip/admin)'
    },
    default: 'user',
    lowercase: true,  // 저장 시 자동으로 소문자로 변환
    trim: true       // 공백 제거
  },
  company: {
    type: String,
    required: function() {
      return this.role === 'vip';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 비밀번호 해싱
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 비밀번호 검증 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 