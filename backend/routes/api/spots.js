const express = require('express');
const { Spot } = require('../../db/models');
const spot = require('../../db/models/spot');
const { UPDATE } = require('sequelize/lib/query-types');
const router = express.Router();

// Get all spots
router.get('/', async (req,res) => {
    return res.status(200).json(await Spot.findAll())
})


// // Get spot filtered
// router.get('/filtered', async (req,res) => {

// })

// Get spot details based on spot ID
router.get('/:spotId', async (req,res) => {
    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}})

    if (!spot) {
        return res.status(400).json({
           "message": "Spot couldn't be found"
        })
    }

    const returnSpot = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: spot.numReviews,
        avgStarRating: spot.avgStarRating,
        // add SpotImages
    }

    return res.status(200).json(returnSpot)

})

// Create new spot
router.post(
    '/',
    //validateCreateSpot,
    async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification required' });
        }

        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const currentUserId = req.user.id;
        const spot = await Spot.create({ ownerId: currentUserId, address, city, state, country, lat, lng, name, description, price });

        const returnSpot = {
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
        }

        return res.status(201).json({spot: returnSpot})
    }
)

// Delete spot
router.delete('/:spotId', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentification required' });
    }
    
    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}})

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    if (!spot) {
        return res.status(400).json({
           "message": "Spot couldn't be found"
        })
    }

    await Spot.destroy({
        where: { id: spotId }
    });

    return res.json({ message: 'Successfully deleted' });
    }
  );

module.exports = router;