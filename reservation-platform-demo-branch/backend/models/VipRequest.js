const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
      allowNull: false,
    },
    vip_card_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('대기', '승인', '거절'),
      defaultValue: '대기',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'vip_requests',
    timestamps: false,
  });

  return VipRequest;
}; 