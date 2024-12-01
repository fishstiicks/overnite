'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
      },
      previewImage: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lat: {
        type: Sequelize.FLOAT,
        defaultValue: null
      },
      lng: {
        type: Sequelize.FLOAT,
        defaultValue: null
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      numReviews: {
        type: Sequelize.INTEGER
      },
      avgRating: {
        type: Sequelize.FLOAT,
        defaultValue: null
      },
      imagePrev: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageOne: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      imageTwo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      imageThree: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      imageFour: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  }
};