import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
});

const User = module.exports = model('User', userSchema);

module.exports.createUser = async function(user: any, cb: Function) {
    console.log(`* Calling function 'createUser()' from models/user`);
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log(`* User model: error generating salt for new user`);
        } else {
            console.log(`* User model: salt generated successfully`)
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    console.log(`* User model: hash error`);
                } else {
                    console.log(`* User model: hash successful, saving new user`);
                    user.password = hash;
                    user.save(cb);
                }
            });
        }
    });
};

module.exports.isValidPassword = function(password: string, hash: string, cb: Function) {
    bcrypt.compare(password, hash, (err, match) => {
        if (err) throw err
        cb(null, match);
    });
}