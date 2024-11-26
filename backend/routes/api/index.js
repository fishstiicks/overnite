const router = require('express').Router();
const loginRouter = require('./login.js');
const logoutRouter = require('./logout.js');
const signupRouter = require('./users.js');
const userRouter = require('./user.js');
const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js');
const reviewsRouter = require('./reviews.js');
const sessionRouter = require('./session.js')

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);


router.use('/login', loginRouter);
router.use('/logout', logoutRouter);
router.use('/users', signupRouter);
router.use('/user', userRouter);
router.use('/spots', spotsRouter);
router.use('/bookings', bookingsRouter);
router.use('/reviews', reviewsRouter);
router.use('/session', sessionRouter);

module.exports = router;