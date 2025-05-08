const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '이름을 입력해주세요.' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: '올바른 이메일 형식을 입력해주세요.' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: '비밀번호는 최소 8자 이상이어야 합니다.'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{10,11}$/,
          msg: '올바른 전화번호 형식을 입력해주세요.'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'vip', 'admin'),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['user', 'vip', 'admin']],
          msg: '유효하지 않은 회원 유형입니다. (user/vip/admin)'
        }
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        companyRequired(value) {
          if (this.role === 'vip' && !value) {
            throw new Error('VIP 회원은 회사명을 입력해야 합니다.');
          }
        }
      }
    }
  }, {
    timestamps: true,
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

  return User;
}; 