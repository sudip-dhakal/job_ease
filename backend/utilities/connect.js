const mongoose = require('mongoose');

function connectToMongoDb(url){
    return mongoose.connect(url);
}

module.exports = connectToMongoDb;
