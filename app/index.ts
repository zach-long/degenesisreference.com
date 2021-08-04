import express from 'express';
const app = express();
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy } from 'passport-local';
const LocalStrategy = Strategy;
import dotenv from 'dotenv';
dotenv.config();

const User = require('./models/User');

// DATABASE
const dbPath: any = process.env.MONGODB_URI

mongoose.connect(dbPath);
const db = mongoose.connection;
db.on('error', console.error.bind(console, `connection error:`));
db.once('open', () => {
    console.log(`MongoDB connected successfully.`);
});

// AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

const localStrategy = new LocalStrategy((username: string, password: string, done: object) => {
    console.log(`* authenticating with local strategy`);
    // User.findOne({username: username}, (err, user) => {
    //     console.log(`* found user '${user.name}'`);
    //     if (err) return done(err);
    //     if (!user) return done(null, false, {message: `Incorrect username.`});
    //     !User.isValidPassword(password, user.password, (err, match) => {
    //         if (err) return done(err);
    //         if (!match) return done(null, false, {message: `Incorrect password.`});
    //         console.log(`* authentication successful`);
    //         return done(null, user);
    //     });
    // });
});

passport.use('local', localStrategy);

// ROUTING
const indexRoutes = require('./routes/index.js');
const itemRoutes = require('./routes/items.js');

app.use(express.static(path.join(__dirname, './../public')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/', indexRoutes);
app.use('/items', itemRoutes);

// CONNECT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application started on port ${port}.`);
});