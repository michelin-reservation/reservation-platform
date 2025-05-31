const sequelize = require('./sequelize');

// 모델 불러오기
const User = require('./User');
const Restaurant = require('./Restaurant');
const Reservation = require('./Reservation');
const Review = require('./Review');
const VipRequest = require('./VipRequest');
const Payment = require('./Payment');

// 관계 설정 (ERD 참고)
// User - Reservation (1:N)
User.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

// Restaurant - Reservation (1:N)
Restaurant.hasMany(Reservation, { foreignKey: 'restaurant_id' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// User - Review (1:N)
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// Restaurant - Review (1:N)
Restaurant.hasMany(Review, { foreignKey: 'restaurant_id' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// User - VipRequest (1:N)
User.hasMany(VipRequest, { foreignKey: 'user_id' });
VipRequest.belongsTo(User, { foreignKey: 'user_id' });

// Reservation - Payment (1:1)
Reservation.hasOne(Payment, { foreignKey: 'reservation_id' });
Payment.belongsTo(Reservation, { foreignKey: 'reservation_id' });

// DB 동기화 함수
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');
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
  Reservation,
  Review,
  VipRequest,
  Payment,
}; 