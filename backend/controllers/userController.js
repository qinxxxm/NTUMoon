const User = require('../models/userModel')
const ResetPassword = require('../models/resetPasswordModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail')
const validator = require('validator')
const { default: isEmail } = require('validator/lib/isEmail')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1h'}) //payload is the user _id from mongodb, we can use this for commenting, users own added module, etc...
}

const createResetToken = (email) => {
    return jwt.sign({email}, process.env.SECRET, { expiresIn: '10m'}) //jwt token for the reseting password, expires in 10minutes
}

//signup
const signupUser = async (req, res) => {
    const {email,username,password} = req.body
    console.log(isEmail)
    console.log(email)
    console.log(username)
    console.log(password)
    try {
        const user = await User.signup(email, username, password) //signup will return user created, with _id, username, password

        //create a token
        const token = createToken(user._id)

        res.status(200).json({username, token})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

//login
const loginUser = async (req, res) => {
    const {username,password} = req.body

    try {
        const user = await User.login(username, password)

        //create a token
        const token = createToken(user._id)

        res.status(200).json({username, token})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const changePassword = async (req, res) => {
    try {
        const {oldPassword,newPassword} = req.body
        const {_id} = req.user
        const user = await User.findOne({ _id: _id})
        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            throw Error('Wrong Password')
        }
        if (!validator.isStrongPassword(newPassword)) {
            throw Error('Password is not strong enough')
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        const passwordChanged = await User.findOneAndUpdate({_id: _id}, {$set: {password:hash}})
        console.log("password changed", passwordChanged)
        
        res.status(200).json(passwordChanged)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changeUsername = async (req, res) => {
    try {
        const {newUsername} = req.body
        const {_id} = req.user
        const usernameChanged = await User.findOneAndUpdate({_id: _id}, {$set: {username:newUsername}})
        console.log("usernameChanged", usernameChanged)
        
        res.status(200).json(usernameChanged)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changeEmail = async (req, res) => {
    try {
        const {newEmail} = req.body
        const {_id} = req.user
        const emailChanged = await User.findOneAndUpdate({_id: _id}, {$set: {email:newEmail}})
        console.log("email changed", emailChanged)
        
        res.status(200).json(emailChanged)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//send reset password link if email exists
const sendEmail = async(req,res) => {
    try {
        const {email} = req.body

        if (!email ) {
            throw Error('Email must be filled!')
        }

        if (!validator.isEmail(email)) {
            throw Error('Email not valid')
        }

        const user = await User.findOne({ email: email})
        if (!user) {
            throw Error('No Such email exists')
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const token = createResetToken(email)
        const existsJwtToken = await ResetPassword.findOne({email: email})
        let emailToken
        if (existsJwtToken) { //updateToken
            emailToken = await ResetPassword.findOneAndUpdate({email: email}, {$set: {token:token}})
        }

        else { //create new email, token
            emailToken = await ResetPassword.create({email: email, token: token})
        }
        emailToken = await ResetPassword.findOne({email: email})
        const msg = {
            to: email, // Change to your recipient
            from: 'soldiero3of@gmail.com', // Change to your verified sender
            subject: 'NTUMoon Reset Password',
            text: 'At NTUMoon, the security of your personal data and log-in details is our first priority. Hi you have requested for a password change, the link is valid for 10 minutes.',
            html: `<p>At NTUMoon, the security of your personal data and log-in details is our first priority.\n</p>
            <p>Hi you have requested for a password change, the link is valid for 10 minutes.\n</p>
            <p>Please enter this token on the password reset page.\n</p>
            <p>${emailToken.token}\n</p>
            <a href="http://localhost:3000/resetPassword">Click here to reset Password</a>`,
        }
        const sendEmail = sgMail.send(msg)
        

        res.status(200).json(emailToken)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//reset password link
const resetPassword = async(req,res) => {
    try {
        const {token, password} = req.body
        const jwtToken = await ResetPassword.findOne({ token: token})
        if (!jwtToken) { //check if token exists
            throw Error('No Such token exists')
        }

        jwt.verify(token, process.env.SECRET, function(err){
            if(err) {
                throw Error("Token Expired")
            }
        })

        if (!validator.isStrongPassword(password)) {
            throw Error('Password is not strong enough')
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const tokenEmail = await ResetPassword.findOne({token: token})
        const passwordChanged = await User.findOneAndUpdate({email: tokenEmail.email}, {$set: {password:hash}})
        console.log("password changed", passwordChanged)
        
        res.status(200).json(passwordChanged)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {signupUser, loginUser, changePassword, changeUsername, changeEmail, sendEmail, resetPassword}  