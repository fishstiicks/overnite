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
        ownerId: 3,
        name: 'Chuck E Cheese',
        address: '359 Cheese Plaza',
        city: 'Cheesetown',
        state: 'Wyoming',
        country: 'United States',
        description: 'The pride and joy of Charles Edwin Cheese. Only stinks a little.',
        price: 500,
        imagePrev: 'https://www.foodandwine.com/thmb/zSAKR76c3XmXAIorF_Ku3xsAd1w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gettyimages-1006806824-2000-b64386689fa4431183b25ad1c8a89f7b.jpg',
        imageOne: 'https://www.chuckecheese.com/wp-content/uploads/2024/04/placeholder1.jpg',
        imageTwo: 'https://i.ytimg.com/vi/B48qYoyJGyw/maxresdefault.jpg',
        imageThree: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/beaumont/Chuck-E-Cheese-ff43f39e5056b36_ff43f49f-5056-b365-ab92dffd21450869.png',
        imageFour: 'https://i0.wp.com/bayareatelegraph.com/wp-content/uploads/2023/08/2023-08-11-11.42.41.jpg?fit=4032%2C3024&ssl=1'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      name: { [Sequelize.Op.in]: ['Chuck E Cheese'] } 
    }, {});
  }
};
