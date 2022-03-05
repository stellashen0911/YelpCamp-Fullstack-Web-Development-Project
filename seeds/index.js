const mongoose = require('mongoose');
const { deleteMany } = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');



//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection errors:"));
db.once("open", ()=> {
    console.log("database connected!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seeddb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50);
        const camp = new Campground({
            author: '62225e53a9a334db18314d88',
            location:`${cities[random1000].city}, ${cities[random1000.state]}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            price: price,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'ok this is so cool for yelpcamp'
        })
        await camp.save();
    }    
};

seeddb().then(() => {
    mongoose.connection.close();
});