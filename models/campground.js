const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const { campgroundSchema } = require('../schema');
//this following line help use to shorthen the schema code
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

//remember to include this line so that you can use the campground as a 
//constructor on app.js file
//last time i made a misteak here and debugging for long time
module.exports = mongoose.model('Campground', CampgroundSchema);