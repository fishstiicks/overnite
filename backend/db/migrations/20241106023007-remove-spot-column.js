'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bookings', 'spot'),
    options;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bookings', 'spot', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  }
};
