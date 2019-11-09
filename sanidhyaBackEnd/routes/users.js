const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require('passport');
// const multer = require('multer')

const validateRegisterInput = require('../validation/register');

const validateLoginInput = require('../validation/login');

const User = require("../models/user");

// const storage = multer.diskStorage({
//     destination: function (req,file,callback){
//         callback(null, "../public/images")
//     },
//     filename: function(req,file,callback){
//         callback(null, file.fieldname + )
//     }
// })


//test route
router.get("/test", (req, res) => {
    res.json({ msg: "this is user test" })
})

//register route
router.post("/register", (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = "Email already exists";
                res.status(400).json(errors)
            } else {

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    contact: req.body.contact,
                    lastlocation: req.body.lastlocation,
                    deviceid: req.body.deviceid,
                    authorisation: req.body.authorisation
                    // image: req.file.filename
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.json(user);
                            })
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }


    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "User not found";
                return res.status(404).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(ismatch => {
                    if (ismatch) {
                        //res.json({msg: "success"});
                        //user matched
                        //create jwt payload
                        const payload = {
                            id: user.id,
                            name: user.name
                        }

                        //sign token
                        jwt.sign(payload, keys.jwtsecret, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token,
                            })
                        })
                        User.update({email: req.body.email}, {$set: {"deviceid":req.body.deviceid}})

                    }
                    else {
                        errors.password = "Password incorrect"
                        return res.status(400).json(errors)
                    }
                })
        })
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        // id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        contact: req.user.contact
    })
})

module.exports = router;