const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    }
});

const userModel = mongoose.model('Collection1', user);
module.exports = userModel;
