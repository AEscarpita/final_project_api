const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema =  new Schema({

    stateCode: {type: String, unique:true, required:true},

    funFacts: [String] 

})

module.exports = mongoose.model('State', stateSchema);