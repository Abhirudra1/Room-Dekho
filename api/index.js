const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const app = express()

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


// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection

app.get('/test', (req, res) => {
    res.json('Hello World!')  
})

app.post('/register',async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const userDoc =await User.create({
            name,
            email, 
            password:bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc)
    } catch(e){
        res.status(422).json(e);
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = await bcrypt.compare(password, userDoc.password);
        if (passOk) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id, 
                // name: userDoc.name
            },  jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        } else {
            res.status(422).json('Wrong password')
        }
    } else {
        res.status(422).json('User not found')
    }
})

app.get('/profile', (req, res) => {
    const {token}  = req.cookies;
    if (!token) {
        res.json(null)
    } else {
        jwt.verify(token, jwtSecret, {},async (err, userData) => {
            if (err) {
                console.error(err);
                res.status(401).json({ message: 'Invalid token' });
            } else {
                const {name, email, _id} = await User.findById(userData.id);
                res.json({name, email, _id});
            }
        })
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


app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    })
    res.json(newName)
})

app.listen(4000, () => {
    console.log('Server started on port 4000')
})



