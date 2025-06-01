const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'michelin_dev',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// 모델 관계 설정
const User = require('./User');
const Restaurant = require('./Restaurant');
const Reservation = require('./Reservation');
const Review = require('./Review');

// User - Restaurant 관계
User.hasMany(Restaurant, { foreignKey: 'ownerId', as: 'restaurants' });
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User - Reservation 관계
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Restaurant - Reservation 관계
Restaurant.hasMany(Reservation, { foreignKey: 'restaurantId', as: 'reservations' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// User - Review 관계
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Restaurant - Review 관계
Restaurant.hasMany(Review, { foreignKey: 'restaurantId', as: 'reviews' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// 데이터베이스 동기화 함수
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');
    
    // 개발 환경에서만 테이블 자동 생성
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('데이터베이스 테이블 동기화 완료');
    }
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Restaurant,
  Reservation,
  Review
}; 