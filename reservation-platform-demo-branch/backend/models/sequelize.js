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
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Restaurant = require('./Restaurant')(sequelize, Sequelize.DataTypes);
const Reservation = require('./Reservation')(sequelize, Sequelize.DataTypes);
const Review = require('./Review')(sequelize, Sequelize.DataTypes);
const Favorite = require('./Favorite')(sequelize, Sequelize.DataTypes);

// 관계 선언은 각 모델의 associate에서만 선언
if (User.associate) User.associate(sequelize.models);
if (Restaurant.associate) Restaurant.associate(sequelize.models);
if (Reservation.associate) Reservation.associate(sequelize.models);
if (Review.associate) Review.associate(sequelize.models);
if (Favorite.associate) Favorite.associate(sequelize.models);

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
  Review,
  Favorite
}; 