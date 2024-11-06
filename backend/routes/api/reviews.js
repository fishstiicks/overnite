const express = require('express');
const { Review, Spot, reviewImage } = require('../../db/models');
const router = express.Router();


// Add image to review by ID
router.post('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({
           "message": "Review couldn't be found"
        })
    }

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    const totalImages = await reviewImage.findAndCountAll({where: {reviewId: reviewId}})
    if (totalImages.count === 10) {
        return res.status(403).json({ "message": "Maximum number of images for this resource was reached" })
    }

    // Construct
    const { url } = req.body;
    const revimg = await reviewImage.create({ reviewId: reviewId, url });

    return res.status(201).json({
        id: revimg.id,
        url: revimg.url})
})


// Edit review by ID
router.put('/:reviewId', async (req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const currentReview = await Review.findByPk(reviewId);

    if (!currentReview) {
        return res.status(404).json({
           "message": "Review couldn't be found"
        })
    }

    if (currentReview.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Data Validation
    if (!review) { return res.status(400).json({
        "message": "Bad Request",
        "errors": {"review": "Review text is required"}})}

    if (stars < 1 || stars > 5) { return res.status(400).json({
        "message": "Bad Request",
        "errors": {"review": "Stars must be an integer from 1 to 5"}})}

    // Construct
    currentReview.review = review;
    currentReview.stars = stars;
    currentReview.updatedAt = new Date();
    await currentReview.save();

    const spot = await Spot.findByPk(currentReview.spotId);
    const spotReviews = await Review.findAndCountAll({where: {spotId: spot.id}});
    spot.avgRating = (spotReviews.rows.map(rev => {return rev.stars}).reduce((acc, cv) => acc + cv)) / spotReviews.count;
    await spot.save();

    return res.status(200).json({
        id: currentReview.id,
        userId: currentReview.userId,
        spotId: currentReview.spotId,
        review: currentReview.review,
        stars: currentReview.stars,
        createdAt: currentReview.createdAt,
        updatedAt: currentReview.updatedAt
    })
})


// Delete review by ID
router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const review  = await Review.findByPk(reviewId);
    if (!review) {
        return res.status(404).json({
           "message": "Review couldn't be found"
        })
    }

    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct

    await Review.destroy({
        where: { id: reviewId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})


// Delete image from review by IDs
router.delete('/:reviewId/:imageId', async(req, res) => {
    // Authenticate
    if (!req.user) {
        return res.status(401).json({ "message": 'Authentication required' });
    }

    const { reviewId, imageId } = req.params;
    const review = await Review.findByPk(reviewId);
    const revimg = await reviewImage.findByPk(reviewId);

    if (review.userId !== req.user.id) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    // Construct
    if (!revimg) {
        return res.status(404).json({
           "message": "Review Image couldn't be found"
        })
    }

    await revimg.destroy({
        where: { id: reviewId, imageId: imageId }
    });

    return res.status(200).json({ "message": 'Successfully deleted' });
})

module.exports = router;