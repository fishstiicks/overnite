const router = require('express').Router();
const sessionRouter = require('./session.js');
const userRouter = require('./user.js');
const spotsRouter = require('./spots.js');

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/user', userRouter);
router.use('/spots', spotsRouter);

module.exports = router;