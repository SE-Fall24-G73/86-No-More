const mongoose = require('mongoose');


const reductionSchema = new mongoose.Schema({
    metric: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    }
  
});


const Reduction = mongoose.model('Reduction', reductionSchema);

module.exports = Reduction;