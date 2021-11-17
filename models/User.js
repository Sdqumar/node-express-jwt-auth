const mongoose = require("mongoose");
const {isEmail} = require('validator')
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required:[ true, 'Please enter an email address'],
    unique: true,
    lowercase: true,
    validate:[isEmail, 'please enter a valid email']
  },
  password: {
    type: String,
    required: [ true, 'Please enter a valid password'],
    minlength: [6, 'Minimum password length should be 6 char'],
  },
});


//fire a function before doc saved to db
userSchema.pre('save', async function (next){
    this.password = await argon2.hash(this.password);
    next()
})

//static method to login user
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth = await argon2.verify(user.password,password)
        if(auth){
            return user
        }

        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('users', userSchema)


module.exports = User