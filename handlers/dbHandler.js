const mongoose = require('mongoose');

async function connectDB() {
    try {
        const result = await mongoose.connect('mongodb://localhost:27017/');
        if (result) {
            console.log("works");
        }
    } catch (err) {
        console.error("could not connect", err);
    }
}


module.exports = {
    connectDB
}


