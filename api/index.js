const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader');
const Place = require('./models/Place')
const Booking = require('./models/Booking')
const { S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer')
const mime = require('mime-types')
const bcrypt = require('bcryptjs');
require('dotenv').config()
const app = express()
const fs = require('fs')

const bucket = 'abhi-roomdekho';


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asdjkgjasdgfjksgd545d4fgawse2354r23w@45323asdfc'

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    // origin: '*',
}))

async function connection(){
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB')
    } catch(err){
        console.error(err)
    }
}
// MongoDB connection
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(()=>{
//     console.log("MongoDB connected")
// }).catch((err)=>{
//     console.log(err)
// })


async function uploadToS3(path, originalFileName, mimemtype){
    connection();
    const client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    })
    const parts = originalFileName.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = Date.now() + '.' + ext;
    try{
            await client.send(new PutObjectCommand({
            Bucket: bucket,
            Body: fs.readFileSync(path),
            Key: newFileName,
            ContentType: mimemtype,
            ACL: 'public-read'
        }))
        console.log(`https://${bucket}.s3.amazonaws.com/${newFileName}`)
        return `https://${bucket}.s3.amazonaws.com/${newFileName}`
    }catch(err){
        throw  err;
    }
}


function getUserDataFromReq(req){
    connection();
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        })
    })
}


app.get('/api/test', (req, res) => {
    connection();
    res.json('Hello World!')  
})

app.post('/api/register',async (req, res) => {
    connection();
    const { name, email, password } = req.body;
    try{
        const userDoc =await User.create({
            name,
            email, 
            password:bcrypt.hashSync(password, bcryptSalt),
        })
        jwt.sign({email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true
            }).status(201).json({userDoc, token})
        })
    } catch(error){
        res.status(500).json(error);
    }
})

app.post('/api/login', async (req, res) => {
    connection();
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            const token = jwt.sign({
                email: userDoc.email,
                id: userDoc._id, 
                // name: userDoc.name
            },  jwtSecret, {});
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true,
            }).json(userDoc);
        } else {
            res.status(422).json('Wrong password')
        }
    } else {
        res.status(422).json('User not found')
    }
})

app.get('/api/profile', (req, res) => {
    connection();
    const {token}  = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {},async (err, userData) => {
            if (err) {
                console.error(err);
                res.status(401).json({ message: 'Invalid token' });
            } else {
                const {name, email, _id} = await User.findById(userData.id);
                res.json({name, email, _id});
            }
        })
    } else {
        res.json(null)
    }
})

// The error is caused by the line `jwt.verify(token, jwtSecret, {},async (err, userData) => {`.
// The `jwt.verify` function is called with the `token` variable, which is `undefined` if the
// cookie is not present. This is causing the error because `jwt.verify` is expecting a JWT token
// as its first argument, but it is receiving `undefined` instead. To fix this, we need to add a
// check to ensure that the `token` variable is not `undefined` before calling `jwt.verify`. We can
// do this by adding a simple `if` statement to check if the `token` variable is truthy. If it is not,
// we can return a 401 status code with an error message. If it is truthy, we can call `jwt.verify`
// as before.


app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {sameSite: 'none', secure: true}).json(true)
})

app.post('/api/upload-by-link', async (req, res) => {
    connection();
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: '/tmp/' + newName,
    })
    const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup(newName));
    res.json(url);
})


const photoMiddleware = multer({ dest: '/tmp' });
app.post('/api/upload', photoMiddleware.array('photos',100), async (req, res) => {
    connection();
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalname, mimetype} = req.files[i];
        const url = await uploadToS3(path, originalname, mimetype);
        uploadedFiles.push(url);
    }
    res.json(uploadedFiles);
})


app.post('/api/places', (req,res) => {
    connection();
    const {token} = req.cookies;
    const {
      title,address,addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price
    } = req.body;
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const placeDoc = await Place.create({
            owner:userData.id,price,
            title,address,photos:addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests, 
          });
          res.json(placeDoc);
        });
    } else{
        return res.status(401).json({ message: 'Unauthorized' });
    }
  });


app.get('/api/user-places', (req, res)=>{
    connection();
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        const places = await Place.find({owner:id});
        res.json(places);
    })
})

app.get('/api/places/:id',async (req, res)=>{
    connection();
    const {id} = req.params;
    res.json(await Place.findById(id));
})

app.put('/api/places', async (req, res) => {
    connection();
    const {token} = req.cookies;
    const {
      id,title,address,addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests, price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
          placeDoc.set({
            title,address,photos:addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests,price
          });
          placeDoc.save();
          res.json('ok');
        }
    })
})


app.get('/api/places', async (req, res)=>{
    connection();
    res.json(await Place.find());
})

app.get('/api/places/:id', async (req, res)=>{
    connection();
    const {id} = req.params;
    res.json(await Place.findById(id));
})

app.post('/api/bookings',async (req, res) =>{
    connection();
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, 
        name, phone, price } =req.body;
        Booking.create({
            place, checkIn, checkOut,numberOfGuests,
            name, phone, price, user: userData.id
        }).then((doc) =>{
            res.json(doc)
        }).catch((err) =>{
            throw err;
        })
})


app.get('/api/bookings', async (req, res) =>{
    connection();
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({user:userData.id}).populate('place'))
})



app.listen(4000, () => {
    console.log('Server started on port 4000')
})



