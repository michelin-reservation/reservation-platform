const { sequelize, syncDatabase, User, Restaurant, Reservation, Review } = require('./sequelize');

// 추가 모델 불러오기
const VipRequest = require('./VipRequest')(sequelize);
const Payment = require('./Payment')(sequelize);

// User - VipRequest 관계
User.hasMany(VipRequest, { foreignKey: 'user_id' });
VipRequest.belongsTo(User, { foreignKey: 'user_id' });

// Reservation - Payment 관계
Reservation.hasOne(Payment, { foreignKey: 'reservation_id' });
Payment.belongsTo(Reservation, { foreignKey: 'reservation_id' });

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Restaurant,
  Reservation,
  Review,
  VipRequest,
  Payment
}; 