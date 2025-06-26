const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // 실제 운영 시 필수로 바꿀 수 있음
    },
    user_type: {
      type: DataTypes.ENUM('일반', 'VIP', '관리자'),
      defaultValue: '일반', // 실제 운영 시 기본값/옵션을 바꿀 수 있음
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true, // VIP 회원의 경우 회사명 저장
    },
    vip_card_number: {
      type: DataTypes.STRING,
      allowNull: true, // VIP 회원의 카드번호 저장
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'users',
    timestamps: false, // created_at을 직접 관리하므로
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  // 비밀번호 검증 메서드
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // 관계 선언 (실무 표준)
  User.associate = (models) => {
    User.hasMany(models.Restaurant, { foreignKey: 'owner_id', as: 'restaurants' });
    User.hasMany(models.Reservation, { foreignKey: 'user_id', as: 'reservations' });
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
    User.hasMany(models.Favorite, { foreignKey: 'user_id', as: 'favorites' });
  };

  return User;
}; 