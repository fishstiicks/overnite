'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previewImage: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isWithinLatRange(value) {
          if (value < -90 || value > 90) {
            throw new Error('Latitude must be within -90 and 90')
          }
        }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isWithinLngRange(value) {
          if (value < -180 || value > 180) {
            throw new Error('Longitude must be within -180 and 180')
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING(49),
      allowNull: false,
      validate: {
        isUnder50Char(value) {
          if (value.length >= 50) {
            throw new Error('Name must be less than 50 characters')
          }
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value <= 0) {
            throw new Error('Price per day must be a positive number')
          }
        }
      }
    },
    numReviews: DataTypes.INTEGER,
    avgRating: DataTypes.FLOAT,
    imagePrev: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageOne: DataTypes.STRING,
    imageTwo: DataTypes.STRING,
    imageThree: DataTypes.STRING,
    imageFour: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Spot'
    
  });
  return Spot;
};