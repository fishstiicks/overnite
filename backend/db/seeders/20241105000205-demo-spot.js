'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        address: '100 blah street',
        city: 'las vegas',
        state: 'casino',
        country: 'corn',
        lat: -40,
        lng: -39,
        name: 'mansion',
        description: 'with the best kernels',
        price: 30
      },
      {
        address: '9239 blahblah lane',
        city: 'butter',
        state: 'milk',
        country: 'mashed potato',
        lat: 40.45,
        lng: 39.25,
        name: 'potato medley',
        description: 'yumtastic',
        price: 200
      },
      {
        address: '3490342 driving drive',
        city: 'bigcity',
        state: 'texas',
        country: 'usa',
        lat: 82,
        lng: -174,
        name: 'real name',
        description: 'definitely a real place',
        price: 15
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['mansion', 'potato medley', 'real name'] }
    }, {});
  }
};