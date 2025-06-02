const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('대기', '확정', '취소'),
      defaultValue: '대기',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'reservations',
    timestamps: false,
  });

  return Reservation;
}; 