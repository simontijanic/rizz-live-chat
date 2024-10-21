const mongoose = require('mongoose');

async function connectDB(MONGODB_URI) {
    try {
        const result = await mongoose.connect(MONGODB_URI);
        if (result) {
            console.log("Mongo DB Connected ");
        }
    } catch (err) {
        console.error("could not connect", err);
    }
}


module.exports = {
    connectDB,
}


