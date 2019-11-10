const express = require("express")
const router = express.Router();
const multer = require('multer')
const passport = require('passport');
const jwt = require("jsonwebtoken");
const image2base64 = require('image-to-base64');

const Storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,"routes/images")
    },
    filename: function(req,file,callback){
        callback(null,file.fieldname + req.body.addedby + file.originalname)
    }
})

const upload = multer({storage:Storage})

const Child = require("../models/post");

router.get("/test", (req, res) => {
    res.json({ msg: "this is user test" })
})
const fs = require('fs');
const axios  = require('axios')
const faceapi = require('face-api.js');
const tf = require('@tensorflow/tfjs-core');


const MODEL_URL = `${__dirname}/weights/`;
const canvas = require("canvas");

// var path = require('path');
// const fetch = require('node-fetch');



const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

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
        {
          res.json(data)
        }
    })
  })

router.get("/getimage/:id",(req,res1) => {
  image2base64(`${__dirname}/images/${req.params.id}`)
  .then(res => {
    res1.json(res)
  })
})
// ,passport.authenticate('jwt', { session: false })

router.post('/imagereco',  passport.authenticate('jwt', { session: false }),(req,res)=>{
  let arr = []
  let arr2 = []
  console.log("came")
    const {base64Data} = req.body;
    fs.writeFile( __dirname+'/images/'+'test.jpg', base64Data, 'base64', (err)=>{
        console.log(err)
    })
    console.log(typeof base64)

    const ImPath = __dirname+'/images/';
    var optionObject = {
        filename: 'test',
        type: 'jpg',
    } 
    // base64ToImage('data:'+base64, ImPath, optionObject)
    console.log(__dirname)
    const REFERENCE_IMAGE = __dirname +  '/images/test.jpg';
    
    const faceDetectionNet = faceapi.nets.ssdMobilenetv1
// const faceDetectionNet = faceapi.nets.tinyFaceDetector
// export const faceDetectionNet = mtcnn
// const faceDetectionNet = faceapi.nets.tinyYolov2

// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 1024
const scoreThreshold = 0.5

// MtcnnOptions
const minFaceSize = 50
const scaleFactor = 0.8

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : (net === faceapi.nets.tinyFaceDetector
      ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
      : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
    )
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)

    
    Child.find({"flag": "0"}, (err, data) => {
      if(err) throw err;
      else{
          data.forEach(ele => {
            arr.push(ele)
          
          })
          console.log("found missing" + arr)
  // async function run(QUERY_IMAGE,resultsRef){
    
  // }
  
  async function run1(){

  
  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL)
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
  console.log("model loaded")
  const referenceImage = await canvas.loadImage(REFERENCE_IMAGE)
  const resultsRef = await faceapi.detectAllFaces(referenceImage, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptors()
  console.log("descriptors of photo taken")
    // arr.map(async (child) => {
      // for(let i=0;i<arr.length;i++){
      //   console.log("in for loop on",i)
      // let QUERY_IMAGE = __dirname + '/images/' + arr[i].image;
      // run(QUERY_IMAGE,resultsRef)

    // })

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const start = async () => {
  await asyncForEach(arr, async (num) => {
    console.log("in forEach loop on",num)
      let QUERY_IMAGE = __dirname + '/images/' + num.image;
      // await run(QUERY_IMAGE,resultsRef)
      console.log('in run for',QUERY_IMAGE)
    let queryImage = await canvas.loadImage(QUERY_IMAGE)
    let resultsQuery = await faceapi.detectAllFaces(queryImage,  new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })).withFaceLandmarks().withFaceDescriptors()
    let faceMatcher = new faceapi.FaceMatcher(resultsRef)
        // console.log(resultsQuery,'resultquery')
        let bestMatch = faceMatcher.findBestMatch(resultsQuery[0].descriptor)
        console.log(bestMatch,"founnd",bestMatch.distance)
        arr2.push({distance:bestMatch.distance,user:num})
        
    console.log(num);
  });
  console.log('Done');
  arr2 = arr2.filter(num => num.distance<0.5)
  console.log(arr2)
  if(arr2.length>0){
  axios.post('https://onesignal.com/api/v1/notifications', {
        "app_id": "b874ca8d-278b-4a27-a17b-2a3d98d3da42",
        "include_player_ids": ["14f0e77c-e76a-49d9-896c-1abfba976b03"],
        "data": {"foo": "bar"},
        "contents": {"en": `${arr2[0].user.name} has been found by ${req.user.name} at latitude-${req.body.lat} and longitude-${req.body.long}`}
      })
      .then(res=>{console.warn(res.data)})
      .catch(err=>{
        console.log(err)
      })
}
}
start();
  }

  
  run1()
}
})

// import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';
// let canvas = require('./commons/')

// async function run() {

  

  
  
  
    // console.log(faceMatcher)
    // const labels = faceMatcher.labeledDescriptors
    //   .map(ld => ld.label)
    // const refDrawBoxes = resultsRef
    //   .map(res => res.detection.box)
    //   .map((box, i) => new faceapi.draw.DrawBox(box, { label: labels[i] }))
    // const outRef = faceapi.createCanvasFromMedia(referenceImage)
    // refDrawBoxes.forEach(drawBox => drawBox.draw(outRef))
  
    // saveFile('referenceImage.jpg', outRef.toBuffer('image/jpeg'))
  
    // const queryDrawBoxes = resultsQuery.map(resON => {

      // res.json(bestMatch)
      
      //return new faceapi.draw.DrawBox(res.detection.box, { label: bestMatch.toString() })
    // })
    // const outQuery = faceapi.createCanvasFromMedia(queryImage)
    // queryDrawBoxes.forEach(drawBox => drawBox.draw(outQuery))
    // saveFile('queryImage.jpg', outQuery.toBuffer('image/jpeg'))
    // console.log('done, saved results to out/queryImage.jpg')
  // }
  
  // run()
  
})

router.post('/add/:id', upload.single("photo"),(req,res) => {
  console.log("in route")
  console.log(req.body)
  let category = req.params.id
  const newchild= new Child({
      name:req.body.name,
      age: req.body.age,
      idetification: req.body.idetification,
      addedby: req.body.addedby,
      image: req.file.filename,
      flag: category
  })
  newchild.save().then(child => res.json(child))
})


module.exports = router;
