const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Restaurant = sequelize.define('Restaurant', {
    restaurant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    menu: {
      type: DataTypes.JSON, // 실제 운영 시 JSON 또는 문자열로 관리
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING, // 쉼표로 구분된 문자열 등으로 관리 가능
      allowNull: true,
    },
    corkage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    parking: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    number_of_seats: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    commission_fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'restaurants',
    timestamps: false,
  });

  // 관계 선언 (실무 표준)
  Restaurant.associate = (models) => {
    Restaurant.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    Restaurant.hasMany(models.Reservation, { foreignKey: 'restaurant_id', as: 'reservations' });
    Restaurant.hasMany(models.Review, { foreignKey: 'restaurant_id', as: 'reviews' });
    Restaurant.hasMany(models.Favorite, { foreignKey: 'restaurant_id', as: 'favorites' });
  };

  return Restaurant;
}; 