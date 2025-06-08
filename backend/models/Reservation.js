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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'reservations',
    timestamps: false,
  });

  // 관계 선언 (실무 표준)
  Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Reservation.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });
  };

  return Reservation;
}; 