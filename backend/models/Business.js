const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Business = sequelize.define('Business', {
    business_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    business_hours: { type: DataTypes.JSON, allowNull: true },
    seats: { type: DataTypes.JSON, allowNull: true },
    notifications: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'businesses',
    timestamps: false,
  });

  Business.associate = (models) => {
    Business.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Business.hasMany(models.Restaurant, { foreignKey: 'owner_id', as: 'restaurants' });
  };

  return Business;
}; 