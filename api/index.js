const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs');
require('dotenv').config()
const app = express()

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json())

app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    // origin: '*',
}))


// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
})
const db = mongoose.connection

app.get('/test', (req, res) => {
    res.json('Hello World!')  
})

app.post('/register',async (req, res) => {
    const { name, email, password } = req.body;
    const userDoc =await User.create({
        name,
        email, 
        password:bcrypt.hashSync(password, bcryptSalt),
    })

    res.json(userDoc)
})

app.listen(4000, () => {
    console.log('Server started on port 4000')
})



