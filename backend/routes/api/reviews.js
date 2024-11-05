const express = require('express');
const router = express.Router();

// Get review by ID
router.get('/:reviewId', (req, res) => {
})

// Add image to review by ID
router.post('/:reviewId', (req, res) => {
})

// Edit review by ID
router.put('/:reviewId', (req, res) => {
})

// Delete review by ID
router.delete('/:reviewId', (req, res) => {
})

// Delete image from review by IDs
router.delete('/:reviewId/:imageId', (req, res) => {
})

module.exports = router;