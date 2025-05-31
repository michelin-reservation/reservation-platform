const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const VipRequest = sequelize.define('VipRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  itinerary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('대기', '승인', '거절'),
    defaultValue: '대기', // 실제 운영 시 기본값/옵션을 바꿀 수 있음
  },
  assigned_staff: {
    type: DataTypes.STRING,
    allowNull: true, // 실제 운영 시 담당자 지정 필요
  },
}, {
  tableName: 'vip_requests',
  timestamps: false,
});

module.exports = VipRequest; 