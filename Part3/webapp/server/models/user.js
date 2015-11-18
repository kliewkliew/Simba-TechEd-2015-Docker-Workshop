// User object in the database

var Mongoose = require('../database').Mongoose,
    Schema = Mongoose.Schema;

var userSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        turnOn: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    date_of_birth: {
        type: Date
    },
    gender: String,
    college_name: String,
    grade: Number,
    created_date: {
        type: Date,
        default: Date.now,
        turnOn: true
    },
    bikes: [],
    activities: [],
    avatar: String,
    is_admin: {
        type: Boolean,
        default: false,
        turnOn: true
    },
    settings: {
      push_notification:{
          type: Boolean,
          default: false,
          turnOn: true
      },
      device_token: [String]
    }
});

userSchema.plugin(require('passport-local-mongoose'), {
    usernameField: 'email',
    hashField: 'password',
    usernameLowerCase: true
});

var User = exports.User = Mongoose.model('User', userSchema, 'users');
