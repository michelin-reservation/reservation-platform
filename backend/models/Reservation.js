const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Reservation = sequelize.define('Reservation', {
  reservation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reservation_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  guest_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  special_request: {
    type: DataTypes.STRING,
    allowNull: true, // 실제 운영 시 옵션/길이 등 조정 가능
  },
  status: {
    type: DataTypes.ENUM('대기', '확정', '취소'),
    defaultValue: '대기', // 실제 운영 시 기본값/옵션을 바꿀 수 있음
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reservations',
  timestamps: false,
});

module.exports = Reservation; 