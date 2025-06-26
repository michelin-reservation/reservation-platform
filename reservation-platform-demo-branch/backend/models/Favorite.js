module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'favorites',
    timestamps: false
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
    Favorite.belongsTo(models.Restaurant, { as: 'restaurant', foreignKey: 'restaurant_id' });
  };

  return Favorite;
}; 