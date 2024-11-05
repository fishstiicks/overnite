const express = require('express');
const user = require('../../db/models/spot');
const router = express.Router();

router.post('/',    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.create({ address, city, state, country, lat, lng, name, description, price });

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

        return res.json({spot: returnSpot})
    }
)