const express = require('express');
const { Op } = require('sequelize');
const { Booking, Sequelize, Spot } = require('../../db/models');
const router = express.Router();


// Edit booking by ID
router.put('/:bookingId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({
           "message": "Booking couldn't be found"
        })
    }

    if (booking.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    // Data Validation
    if (start < currentDate) {
        return res.status(400).json( {"message": "startDate cannot be in the past"})}
    
        if (end <= start) {
        return res.status(400).json( {"message": "endDate cannot be on or before startDate"})}
    
        if (currentDate > end) {
        return res.status(403).json( {"message": "Past bookings can't be modified"})}
        
    // Check spot is already booked for dates

    const endConflict = await Booking.findOne({where: {
        spotId: booking.spotId,
        startDate: { [Op.between]: [start, end]}
    }})

    const startConflict = await Booking.findOne({where: {
        spotId: booking.spotId,
        endDate: {[Op.between]: [start, end]}
    }})

    const betweenConflict = await Booking.findOne({where: {
        spotId: booking.spotId,
        startDate: { [Op.lte]: start },
        endDate: { [Op.gte]: end}
    }})

    if (startConflict) {return res.status(403).json(    {
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking", 
    }})}

    if (endConflict) {return res.status(403).json(    {
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
            "endDate": "End date conflicts with an existing booking"}
    })}

    if (betweenConflict) {return res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
            "endDate": "Dates fall between existing booking"       
    }})}

    // Construct
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.updatedAt = Sequelize.literal('CURRENT TIMESTAMP');

    await booking.save();

    return res.status(200).json({
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    })
})

// Delete booking by ID
router.delete('/:bookingId', async (req, res) => {
    // Authenticate

    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json({
           "message": "Booking couldn't be found"
        })
    }

    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const spot = await Spot.findByPk(booking.spotId);

    if (booking.userId !== req.user.id && spot.ownerId !== req.user) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct

    if (booking.startDate <= new Date()) {
        return res.status(403).json({ "message": "Bookings that have been started can't be deleted"})
    }

    await Booking.destroy({
        where: { id: bookingId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})

module.exports = router;