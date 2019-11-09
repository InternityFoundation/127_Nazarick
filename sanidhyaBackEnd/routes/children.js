const express = require("express")
const router = express.Router();
const multer = require('multer')
const passport = require('passport');
const jwt = require("jsonwebtoken");

const Storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,"public/child")
    },
    filename: function(req,file,callback){
        callback(null,file.fieldname + "_" + req.user._id + "_" + file.originalname)
    }
})

const upload = multer({storage:Storage})

const Child = require("../models/post");

router.get("/test", (req, res) => {
    res.json({ msg: "this is user test" })
})


router.get("/:id", (req,res) => {
    // console.log(req.user)
    let category =req.params.id
    // switch(req.params.id) {
    //     case "missing":
    //         category = "0"
    //         break;
    //     case "found":
    //         category = 1
    //         break;
    //     case "public": 
    //         category = '2'
    //         break;
    //     default:
    //         category = 2
    // }
    Child.find({"flag": category}, (err, data) => {
        if(err) throw err;
        else
            res.json(data)
    })
})
// ,passport.authenticate('jwt', { session: false })
router.post('/:id', upload.single("child"),(req,res) => {
    let category = req.params.id
    const newchild= new Child({
        name:req.body.name,
        age: req.body.age,
        idetification: req.body.idetification,
        addedby: req.body.addedby,
        image: req.body.image,
        flag: category
    })
    newchild.save().then(child => res.json(child))
})

module.exports = router;