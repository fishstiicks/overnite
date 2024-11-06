const express = require('express');
const { Op } = require('sequelize');
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Booking } = require('../../db/models');
const { Review } = require('../../db/models');
const { User } = require('../../db/models');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Latitude is required'),
    check('lat')
        .isInt({min: -90, max: 90})
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Longitude is required'),
    check('lng')
        .isInt({min: -180, max: 180})
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Name is required'),
    check('name')
        .isByteLength({max:49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .withMessage('Price is required')
        .notEmpty()
        .withMessage('Price cannot be empty'),
    check('price')
    .isFloat({ min: 0.01})
    .withMessage('Price per day must be a postive number'),
    handleValidationErrors
  ];

// // Create new spot //added a new check+ if doesnt work keep validateSpot here and dont import+delete from validation
router.post('/', validateSpot, async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const currentUserId = req.user.id;
        const spot = await Spot.create({ ownerId: currentUserId, address, city, state, country, lat, lng, name, description, price });


        return res.status(201).json({
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
            updatedAt: spot.updatedAt
        })
    }
)

// Get all spots
router.get('/', async (req,res) => {
    const spot = await Spot.findAll();

    const returnAllSpots = spot.map(spot => {
        return {
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
            avgRating: spot.avgStarRating,
            previewImage: spot.previewImage,
        }
    })
    
    return res.status(200).json(await Spot.findAll())
})


// Get spots filtered
router.get('/filtered', async (req,res) => {

})

// Get spot details based on spot ID
router.get('/:spotId', async (req,res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId, {
        include: [{model: SpotImage}, {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']}],
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 'numReviews', 'avgRating']
      });

    if (!spot) {
        return res.status(400).json({
           "message": "Spot couldn't be found"
        })
    }

    return res.status(200).json({
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
        avgRating: spot.avgRating,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner 
    })

})

// Delete spot
router.delete('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}})
    
    if (!spot) {
        return res.status(400).json({
           "message": "Spot couldn't be found"
        })
    }

    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await Spot.destroy({
        where: { id: spotId }
    });

    return res.status(200).json({ message: 'Successfully deleted' });
    }
  );

// Edits spot//NOT DONE//this only allows edit if user is authenticated and owner of spot
//validateSpot import gives 404 if not found
router.put('/:spotId',validateSpot, async (req, res) => {
    //authentication
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required'});
    }
    //must be owner
if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: 'You must be owner' });
}
            //find the spot
    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}});

            //couldnt find spot with specified ID
    if(!spot){
       return res.status(404).json({message: "Bad Request"});
    }
            //update spot+save
    
    spot.set({
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            lat: req.body.lat,
            lng: req.body.lng,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
    

    await spot.save();

    return res.status(200).json({spot});
    }
)


// Adds image to spot
router.post('/:spotId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }
    
    const {spotId} = req.params;
    const spot = await Spot.findOne({where: { id: spotId }});

    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})}

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" })}

        
    // Construct
    const { url, preview } = req.body;
    const spotimg = await SpotImage.create({ spotId: spotId, url, preview });

    if (preview === true) {
        spot.previewImage = url;
        
        let formerPreview = await SpotImage.findOne({where: {spotId: spotId, preview: true}})
        formerPreview.preview = false;

        await spot.save();
        await formerPreview.save();
    }

    return res.status(201).json({
        id: spotimg.id,
        url: spotimg.url,
        preview: spotimg.preview
    })})

// Delete image from spot //needs testing
router.delete('/:spotId/images/:imageId', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const {spotId, imageId} = req.params;
    const spotimg = await SpotImage.findOne({where: { id: imageId, spotId: spotId }});

    if(!spotimg){
        return res.status(404).json({message: "Spot Image couldn't be found"})}

    await spotimg.destroy()

    return res.status(200).json({message: "Successfully deleted"})
})


// Get reviews by spot needs testing
router.get('/:spotId/reviews', async (req, res) => {
    const {spotId} = req.params
    const reviewsbyspot = await Spot.findOne({where: {spotId: spotId}})

    if(!spotId){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    const returnReviewsById = {
        Reviews: [
        {
          id: reviewsbyspot.id,
          userId: reviewsbyspot.userId,
          spotId: reviewsbyspot.spotId,
          review: reviewsbyspot.review,
          stars: reviewsbyspot.stars,
          createdAt: reviewsbyspot.createdAt,
          updatedAt: reviewsbyspot.updatedAt,
          User: {
            id: reviewsbyspot.user.id,
            firstName: reviewsbyspot.user.firstName,
            lastName: reviewsbyspot.user.lastName
          },
          ReviewImages: [
            {
                //????????????
              id: reviewsbyspot.ReviewImages.id,
              url: reviewsbyspot.ReviewImages.id
            }
          ],
        }
      ]

    }
    return res.status(200).json(returnReviewsById)
    
})

//danish chill dont do these rn 

// Creates review for spot
router.post('/:spotId/reviews', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const { spotId } = req.params;
    const spot = await Spot.findOne({where: {id:spotId}})

    if (!spot) {
        return res.status(404).json({
           "message": "Spot couldn't be found"
        })
    }

    const currentSpotId = spot.id;
    const currentUserId = req.user.id;

    const alreadyReviewed = await Review.findOne({where: {
        spotId: spotId,
        userId: currentUserId
    }})

    if (alreadyReviewed) {
        return res.status(500).json({
            "message": "User already has a review for this spot"
        })
    }

    // Data Validation
    const { review, stars } = req.body;

    if (!review) { return res.status(400).json({
        "message": "Bad Request",
        "errors": {"review": "Review text is required"}})}

    if (stars < 1 || stars > 5) { return res.status(400).json({
        "message": "Bad Request",
        "errors": {"review": "Stars must be an integer from 1 to 5"}})}

    // Construct
    const currentReview = await Review.create({spotId: currentSpotId, userId: currentUserId, review, stars})

    const spotReviews = await Review.findAndCountAll({where: {spotId: spotId}});
    spot.avgRating = (spotReviews.rows.map(rev => {return rev.stars}).reduce((acc, cv) => acc + cv)) / spotReviews.count;
    spot.numReviews = spotReviews.count;
    await spot.save();

    return res.status(201).json({
        id: currentReview.id,
        userId: currentReview.userId,
        spotId: currentReview.spotId,
        review: currentReview.review,
        stars: currentReview.stars,
        createdAt: currentReview.createdAt,
        updatedAt: currentReview.updatedAt
    })
})


// Get bookings for spot
router.get('/:spotId/bookings', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({
           "message": "Spot couldn't be found"
        })
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(200).json(await Booking.findAll({
            where: {spotId: spotId},
            attributes: ['spotId', 'startDate', 'endDate']
        }))
    }

    return res.status(200).json(await Booking.findAll({
        where: {spotId: spotId},
        attributes: ['spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    }))


})

// Create booking for spot
router.post('/:spotId/bookings', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
    return res.status(404).json({
        "message": "Spot couldn't be found"
    })}

    if (spot.ownerId === req.user.id) {
    return res.status(200).json({ "message": "User cannot book own spot" });
}

    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    if (start < currentDate) {
    return res.status(400).json( {"message": "startDate cannot be in the past"})}

    if (end <= start) {
    return res.status(400).json( {"message": "endDate cannot be on or before startDate"})}

    if (currentDate > end) {
    return res.status(403).json( {"message": "Past bookings can't be modified"})}
    
    const startConflict = await Booking.findOne({where: {
        spotId: spotId,
        startDate: { [Op.between]: [start, end]}
    }})

    const endConflict = await Booking.findOne({where: {
        spotId: spotId,
        endDate: {[Op.between]: [start, end]}
    }})

    if (startConflict) {return res.status(403).json(    {
    "message": "Sorry, this spot is already booked for the specified dates",
    "errors": {
        "startDate": "Start date conflicts with an existing booking",
    }
    })}

    if (endConflict) {return res.status(403).json(    {
    "message": "Sorry, this spot is already booked for the specified dates",
    "errors": {
        "endDate": "End date conflicts with an existing booking"
    }
    })}

    const currentUserId = req.user.id;

    const booking = await Booking.create({ userId: currentUserId, spotId: spotId, startDate: start, endDate: end });


    return res.status(201).json({
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    })

})

module.exports = router;

