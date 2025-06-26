const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NotificationSetting = sequelize.define('NotificationSetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reservation_confirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reservation_reminder: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    review_response: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    marketing_info: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'notification_settings',
    timestamps: false,
  });
  return NotificationSetting;
};