import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import User from './models/User.js';
import routeIndex from './routes/index.js';
import routeTest from './routes/test.js';
import routeMessages from './routes/messages.js';
import routeUsers from './routes/users.js';


// Load environment variables from .env file
dotenv.config();

const app = express();

// Use the CORS middleware
app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://backendtest-wqyv.onrender.com/auth/google/callback' /*For production: https://backendtest-wqyv.onrender.com/auth/google/callback - Local test: /auth/google/callback*/
}, async (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: email,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Event listeners for the connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/', routeIndex);
app.use('/test', routeTest);
app.use('/messages', routeMessages);
app.use('/users', routeUsers);

// Google Authentication Routes
app.get('/auth/google', (req, res, next) => {
  const redirectUri = req.query.redirectUri; // Allow redirect URI from the client
  if (redirectUri) {
    req.session.redirectUri = redirectUri; // Store in session for later use
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;

    // Retrieve the redirect URI stored in the session
    const redirectUri = req.session.redirectUri || 'exp://localhost:19000'; // Use a default fallback URI
    const userInfo = {
      id: user._id, // Include user ID
      username: user.username,
      email: user.email,
    };

    // Redirect back to the Expo app with user information as query params
    const redirectUrl = `${redirectUri}?user=${encodeURIComponent(JSON.stringify(userInfo))}`;
    res.redirect(redirectUrl);
  }
);

// Use the port from the .env file
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});