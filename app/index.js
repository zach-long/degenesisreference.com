"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var path_1 = __importDefault(require("path"));
var mongoose_1 = __importDefault(require("mongoose"));
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var LocalStrategy = passport_local_1.Strategy;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var User = require('./models/User');
var dbPath = process.env.MONGODB_URI;
mongoose_1.default.connect(dbPath);
var db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function () {
    console.log("MongoDB connected successfully.");
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
var localStrategy = new LocalStrategy(function (username, password, done) {
    console.log("* authenticating with local strategy");
    User.findOne({ username: username }, function (err, user) {
        console.log("* found user '" + user.name + "'");
        if (err)
            return done(err);
        if (!user)
            return done(null, false, { message: "Incorrect username." });
        !User.isValidPassword(password, user.password, function (err, match) {
            if (err)
                return done(err);
            if (!match)
                return done(null, false, { message: "Incorrect password." });
            console.log("* authentication successful");
            return done(null, user);
        });
    });
});
passport_1.default.use('local', localStrategy);
var indexRoutes = require('./routes/index.js');
var itemRoutes = require('./routes/items.js');
app.use(express_1.default.static(path_1.default.join(__dirname, './../public')));
app.set('views', path_1.default.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use('/', indexRoutes);
app.use('/items', itemRoutes);
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Application started on port " + port + ".");
});
