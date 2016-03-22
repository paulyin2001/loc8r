var express = require('express');
var router = express.Router();

var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');

/* Locations pages */
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.put('/locations', ctrlLocations.locationsUpdateOne);										//handle locationid not found
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);
router.delete('/locations', ctrlLocations.locationsDeleteOne);
/* reviews pages */
router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
router.put('/locations/:locationid/reviews', ctrlReviews.reviewsUpdateOne);		//handle reviewid not found
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);
router.delete('/locations/:locationid/reviews', ctrlReviews.reviewsDeleteOne);
module.exports = router;
