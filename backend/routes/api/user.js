const { Spot, Booking, User, Review, reviewImage } = require('../../db/models');
const express = require('express');
const router = express.Router();

// Get current user's info
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.status(200).json({
        user: safeUser
      });
    } else return res.status(200).json({ user: null });
  }
);

// Get current user's spots
router.get('/spots', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { user } = req;
  if (user) {
      return res.status(200).json({Spots:
        await Spot.findAll({
        where: {
          ownerId: user.id
        },
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'avgRating', 'previewImage']
      })
  });
  } else return res.status(200).json({ user: null });
});

// Get current user's reviews
router.get('/reviews', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { user } = req;

  if (user) {
    return res.status(200).json({Reviews: 
      await Review.findAll({
      where: {userId: user.id},
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
        },
        {
          model: reviewImage
        }
      ]
    })});
  } else return res.status(200).json({ user: null });
})

// Get current user's bookings
router.get('/bookings', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { user } = req;

  if (user) {
      return res.status(200).json({Bookings: await Booking.findAll({
        where: {userId: user.id},
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        include: [{ model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']}],
      })});
  } else return res.status(200).json({ user: null });
})



  module.exports = router;