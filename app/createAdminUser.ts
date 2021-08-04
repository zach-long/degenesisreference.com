import mongoose from 'mongoose';

const { adminName, adminUsername, adminPassword, adminEmail } = require('./config.js');
const User = require('./models/user.js');

const dbPath = `mongodb+srv://zach:b8RLB3TKeSuwLCE@cluster0.yjmy0.mongodb.net/Cluster0?retryWrites=true&w=majority`;

mongoose.connect(dbPath);
const db = mongoose.connection;
db.on('error', console.error.bind(console, `connection error:`));
db.once('open', () => {
    console.log(`* MongoDB connected successfully at "${dbPath}".`);
    console.log(`* Creating Admin user...`);
    createUserObject().then((uObj) => {
        console.log(`* User object created successfully, preparing to insert into database`);
        insertUserObject(uObj).then((result) => {
            console.log(result);
            mongoose.disconnect((err) => {
                if (err) throw err;
                console.log(`* MongoDB disconnected.`);
            });
        }).catch((err) => {
            console.log(`* Error inserting superuser into database`);
            console.log(err);
        });;
    });
});

async function createUserObject() {
    console.log(`* Creating user object...`);
    let newUser = new User({
        name: adminName,
        username: adminUsername,
        password: adminPassword,
        email: adminEmail
    });
    console.log(`User object:`);
    console.log(newUser);
    return newUser;
}

function insertUserObject(obj: Object) {
    return new Promise((resolve, reject) => {
        console.log(`* Storing user object...`);
        User.createUser(obj, (msg: any) => {
            if (msg && msg.name === 'MongoError' && msg.code === 11000) {
                reject(msg);
            } else if (msg) {
                reject(msg);
            } else {
                resolve(`* Admin user created successfully.`);
            }
        });
    });
}