const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_FACTOR = 11;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchema.pre("save", function (done) {
    if (!this.isModified("password")) return done();
    bcrypt.hash(this.password, SALT_FACTOR, (err, hash) => {
        this.password = hash;
        done();
    });
});

UserSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, (err, result) => {
        done(err, result);
    });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
