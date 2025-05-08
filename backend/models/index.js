const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// 모델 정의
const User = require('./User')(sequelize);
const { Restaurant, MenuItem, BusinessHours } = require('./Restaurant')(sequelize);

// 관계 설정
Restaurant.belongsTo(User, { as: 'owner' });
User.hasMany(Restaurant, { as: 'restaurants' });

// 데이터베이스 연결 및 동기화
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');
    
    // 개발 환경에서만 테이블 자동 생성
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('데이터베이스 동기화 완료');
    }
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Restaurant,
  MenuItem,
  BusinessHours
}; 