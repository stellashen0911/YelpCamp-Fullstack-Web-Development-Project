const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const joi = require('joi');

const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/users');

const { redirect } = require('express/lib/response');
const req = require('express/lib/request');
const passport = require('passport');

const app = express();

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection errors:"));
db.once("open", ()=> {
    console.log("database connected!");
});

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campground', campgroundRoute);
app.use('/campground/:id/reviews', reviewRoute);
app.use('/', userRoute);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({
        title: "my backyard",
        description: "cheap camping"
    });
    await camp.save();
    res.send(camp);
});


app.all('*', (req, res, next) => {
    next(new ExpressErros("Page Not Found!!!", 404));
})

app.use((err, req, res, next) => {
    const {statuscode = 500 } = err;
    if(!err.message) err.message = "Something went wrong!!";
    res.status(statuscode).render('error', {err});
});

app.listen(3000, ()=> {
    console.log("Hello from server");
});