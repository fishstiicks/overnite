const express = require('express');
const router = express.Router();

// Get current user's info
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
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
    return res.status(401).json({ message: 'Authentification required' });
  }

  const { user } = req;
  if (user) {
      return res.status(200).json(
        await Spot.findAll({
        where: {
          ownerId: user.id
        }
      })
    );
  } else return res.status(200).json({ user: null });
}
);

// Get current user's reviews
router.get('/reviews', async (req, res) => {
})

// Get current user's bookings
router.get('/bookings', async (req, res) => {
})


  module.exports = router;