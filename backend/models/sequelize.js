const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'michelin_dev',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || '0426',
  {
    host: process.env.DB_HOST || '127.0.0.1',
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

// 모델 정의
const User = require('./User')(sequelize);
const Restaurant = require('./Restaurant')(sequelize);
const Reservation = require('./Reservation')(sequelize);
const Review = require('./Review')(sequelize);

// User - Restaurant 관계
User.hasMany(Restaurant, { foreignKey: 'owner_id', as: 'restaurants' });
Restaurant.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User - Reservation 관계
User.hasMany(Reservation, { foreignKey: 'user_id', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Restaurant - Reservation 관계
Restaurant.hasMany(Reservation, { foreignKey: 'restaurant_id', as: 'reservations' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });

// User - Review 관계
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Restaurant - Review 관계
Restaurant.hasMany(Review, { foreignKey: 'restaurant_id', as: 'reviews' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });

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