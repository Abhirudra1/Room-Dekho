const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    place: {type: mongoose.Schema.Types.ObjectId, required:true},
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    name: {type: String, required: true},
    phone: {type: String, requied: true},
    price: {type: Number, required: true}
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;
