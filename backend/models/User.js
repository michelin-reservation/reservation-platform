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
    enum: ['normal', 'vip', 'admin'],
    default: 'normal'
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