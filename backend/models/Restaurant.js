const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    district: String // 예: 합정, 을지로 등
  },
  cuisine: {
    type: String,
    required: true // 예: 국수, 냉면 등
  },
  michelinStatus: {
    type: String,
    enum: ['스타', '빕구르망', '플레이트'],
    required: true
  },
  operatingHours: {
    regular: {
      open: String,
      close: String
    },
    breakTime: {
      start: String,
      end: String
    },
    lastOrder: String,
    closedDays: [String]
  },
  contact: {
    phone: String,
    website: String
  },
  facilities: [{
    type: String // 예: 대관 가능, 예약금 등
  }],
  description: {
    type: String,
    required: true
  },
  menu: [{
    name: String,
    price: Number,
    description: String,
    isSignature: Boolean
  }],
  images: [String],
  reservationPolicy: {
    deposit: Number,
    maxPartySize: Number,
    minPartySize: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 업데이트 시 updatedAt 자동 갱신
restaurantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 텍스트 검색을 위한 인덱스 생성
restaurantSchema.index({
  name: 'text',
  'location.district': 'text',
  cuisine: 'text',
  description: 'text'
});

module.exports = mongoose.model('Restaurant', restaurantSchema); 