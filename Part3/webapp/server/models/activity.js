// Activity object in the database

var Mongoose = require('../database').Mongoose,
    Schema = Mongoose.Schema;

var ActivitySchema = new Schema({
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
    end_date: Date,
    end_location: String,
    deadline: Date,
    description: {
        type: String,
        trim: true
    },
    meetup_time: Number,
    meetup_location: String,
    start_date: Date,
    start_location: String,
    distance: Number,
    pace: Number,
    size: Number,
    attendees:[],
    created_date: {
        type: Date,
        default: Date.now,
        turnOn: true
    }
});

module.exports = Mongoose.model('Activity', ActivitySchema, 'activities');
