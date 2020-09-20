const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    description: {
        type: String,
        minlength: 3
    },
    notes: {
        type: String,
        minlength: 3
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;