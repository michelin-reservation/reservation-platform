const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Restaurant = sequelize.define('Restaurant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '레스토랑 이름을 입력해주세요.' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: '레스토랑 설명을 입력해주세요.' }
      }
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '도로명 주소를 입력해주세요.' }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '도시를 입력해주세요.' }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '시/도를 입력해주세요.' }
      }
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '우편번호를 입력해주세요.' }
      }
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/,
          msg: '올바른 전화번호 형식을 입력해주세요.'
        }
      }
    },
    cuisine: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '음식 종류를 입력해주세요.' }
      }
    },
    priceRange: {
      type: DataTypes.ENUM('₩', '₩₩', '₩₩₩', '₩₩₩₩'),
      allowNull: false,
      validate: {
        notEmpty: { msg: '가격대를 입력해주세요.' }
      }
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: '수용 가능 인원을 입력해주세요.' }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  // 메뉴 모델 정의
  const MenuItem = sequelize.define('MenuItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '메뉴 이름을 입력해주세요.' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: '메뉴 설명을 입력해주세요.' }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: '가격을 입력해주세요.' }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: '카테고리를 입력해주세요.' }
      }
    },
    image: {
      type: DataTypes.STRING
    }
  });

  // 영업시간 모델 정의
  const BusinessHours = sequelize.define('BusinessHours', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    day: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false
    },
    open: {
      type: DataTypes.STRING,
      allowNull: false
    },
    close: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  // 관계 설정
  Restaurant.hasMany(MenuItem, { as: 'menu' });
  MenuItem.belongsTo(Restaurant);

  Restaurant.hasMany(BusinessHours, { as: 'businessHours' });
  BusinessHours.belongsTo(Restaurant);

  return { Restaurant, MenuItem, BusinessHours };
}; 