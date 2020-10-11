const mongoose = require('mongoose');

const AdditionalFieldSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    type: {
        type: String,
    }
});

const AdditionalField = mongoose.model('AdditionalField', AdditionalFieldSchema);

module.exports = AdditionalField;
