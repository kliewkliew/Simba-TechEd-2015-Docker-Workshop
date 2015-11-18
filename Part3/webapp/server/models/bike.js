// Bike object in the database

var Mongoose = require('../database').Mongoose,
    Schema = Mongoose.Schema;

var BikeSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        turnOn: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true
    },
    description: String,
    reserve_dates: [{
        start_date: Date,
        end_date: Date
    }],
    images: String,
    brand: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    contact: {
        type: String,
        trim: true
    },
    purchase_year: Number,
    created_date: {
        type: Date,
        default: Date.now,
        turnOn: true
    },
    renters: [],
    pickup_address: String,
    return_address: String
});

module.exports = Mongoose.model('Bike', BikeSchema, 'bikes');
