const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reservation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  service_package: {
    type: DataTypes.STRING,
    allowNull: true, // 실제 운영 시 옵션/종류 등 조정 가능
  },
  additional_services: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reservation_fee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.ENUM('대기', '완료', '취소'),
    defaultValue: '대기', // 실제 운영 시 기본값/옵션을 바꿀 수 있음
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'payments',
  timestamps: false,
});

module.exports = Payment; 