const mongoose = require('mongoose');

// 메뉴 스키마
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '메뉴 이름을 입력해주세요.']
  },
  description: {
    type: String,
    required: [true, '메뉴 설명을 입력해주세요.']
  },
  price: {
    type: Number,
    required: [true, '가격을 입력해주세요.']
  },
  category: {
    type: String,
    required: [true, '카테고리를 입력해주세요.']
  },
  image: {
    type: String
  }
});

// 영업 시간 스키마
const businessHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false
  }
});

// 레스토랑 스키마
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '레스토랑 이름을 입력해주세요.'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '레스토랑 설명을 입력해주세요.']
  },
  address: {
    street: {
      type: String,
      required: [true, '도로명 주소를 입력해주세요.']
    },
    city: {
      type: String,
      required: [true, '도시를 입력해주세요.']
    },
    state: {
      type: String,
      required: [true, '시/도를 입력해주세요.']
    },
    zipCode: {
      type: String,
      required: [true, '우편번호를 입력해주세요.']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  phone: {
    type: String,
    required: [true, '전화번호를 입력해주세요.'],
    match: [/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/, '올바른 전화번호 형식을 입력해주세요.']
  },
  cuisine: {
    type: String,
    required: [true, '음식 종류를 입력해주세요.']
  },
  priceRange: {
    type: String,
    enum: ['₩', '₩₩', '₩₩₩', '₩₩₩₩'],
    required: [true, '가격대를 입력해주세요.']
  },
  businessHours: [businessHoursSchema],
  menu: [menuItemSchema],
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }],
  capacity: {
    type: Number,
    required: [true, '수용 가능 인원을 입력해주세요.']
  },
  isActive: {
    type: Boolean,
    default: true
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

// 위치 기반 검색을 위한 인덱스 생성
restaurantSchema.index({ location: '2dsphere' });

// 업데이트 시 updatedAt 자동 갱신
restaurantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema); 