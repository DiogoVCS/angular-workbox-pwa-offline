const express = require('express');
const app = express();

const mongoose = require('./database/mongoose');

const Report = require('./database/models/report');
const Task = require('./database/models/task');

app.use(express.json());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

/*
    Report: Create, Update, ReadOne, ReadAll, Delete
    Task: Create, Update, ReadOne, ReadAll, Delete
*/

app.get('/api/reports', (req, res) => {
    Report.find({})
        .then(reports => res.send(reports))
        .catch((error) => console.log(error));
});

app.post('/api/reports', (req, res) => {
    console.log(req.body.description);
    (new Report({'description': req.body.description, 'notes': req.body.notes}))
        .save()
        .then((report) => res.send(report))
        .catch((error) => console.log(error));
});

app.get('/api/reports/:reportId', (req, res) => {
    Report.find({_id: req.params.reportId})
        .then((report) => res.send(report))
        .catch((error) => console.log(error));
});

app.patch('/api/reports/:reportId', (req, res) => {
    Report.findOneAndUpdate({_id: req.params.reportId}, {$set: req.body})
        .then((report) => {
          console.log(`Updated report: ${req.params.reportId} with notes ${req.body.notes} plus ${req.method}`)
            res.send({...report._doc, notes: req.body.notes})
        })
        .catch((error) => console.log(error));
});

app.delete('/api/reports/:reportId', (req, res) => {
    Report.findByIdAndDelete(req.params.reportId)
        .then((report) => res.send(report))
        .catch((error) => console.log(error));
});

app.listen(3000, () => console.log('SERVER is CONNECTED ON PORT 3000'));
