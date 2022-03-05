const { campgroundSchema, reviewSchema } = require('./schema.js');
const ExpressErros = require('./utilities/ExpressErrors');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must first login!');
        return res.redirect('/login');
    }
    next();
 }

 module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressErros(msg, 400);
    } else {
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campground/${campground._id}`);
    }
    next();
}