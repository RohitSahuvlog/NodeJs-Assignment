const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { connectDB } = require('./config/db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const User = require('./models/User');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

// Middleware
const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", (req, res) => {
    res.send("Welcome to the server!");
});

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, emails, photos, displayName } = profile;
        const googleEmail = emails[0].value;
        const profilePicture = photos && photos.length > 0 ? photos[0].value : null;

        let user = await User.findOne({ email: googleEmail });

        if (!user) {
            user = new User({
                email: googleEmail,
                googleId: id,
                profilePicture,
                username: displayName,
                phoneNumber: "NA"
            });
        } else {
            user.username = displayName;
            user.googleId = user.googleId || id;
            user.profilePicture = user.profilePicture || profilePicture;
        }
        const token = generateToken(user._id, googleEmail);
        user.accessToken = token;

        await user.save();
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const clientURL = process.env.CLIENT_URL;
        const { username, accessToken } = req.user;
        res.redirect(`${clientURL}?userName=${username}&&accessToken=${accessToken}`);
    }
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Database Connection and Server Start
app.listen(PORT, () => {
    connectDB()
    console.log("listening on port", PORT);
});
