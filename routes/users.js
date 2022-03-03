const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsyn = require('../utilities/CatchAsyn');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsyn(async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registedUser = await User.register(user, password);
        console.log(registedUser);
        req.flash('success', "Successfully registered! Welcome to yelpcamp!");
        res.redirect('/campground'); 
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register'); 
    } 
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', (req, res) => {

})
module.exports = router;