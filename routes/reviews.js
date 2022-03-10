const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsyn = require('../utilities/CatchAsyn');
const Campground = require('../models/campground');
const ExpressErros = require('../utilities/ExpressErrors');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsyn(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campground/${campground._id}`);
}))

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsyn(async(req, res) =>{
    const {id, reviewID} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewID}});
    await Review.findByIdAndRemove(reviewID);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campground/${id}`);
}))

module.exports = router;