module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserName: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false, unique: true },
    Phone: { type: DataTypes.STRING, allowNull: true },
    UserType: { type: DataTypes.ENUM('개인', 'VIP', '법인'), allowNull: false },
    VIPCardRegistered: { type: DataTypes.BOOLEAN, defaultValue: false },
    VIPCardNumber: { type: DataTypes.STRING, allowNull: true },
    CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Reservation, { foreignKey: 'UserID' });
    User.hasMany(models.Review, { foreignKey: 'UserID' });
    User.hasMany(models.VipRequest, { foreignKey: 'UserID' });
  };

  return User;
};



