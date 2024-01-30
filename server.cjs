const express = require('express');
const bodyParser = require('body-parser');
const { connectToDb, getDb } = require('./db.cjs');
const { ObjectId } = require('mongodb');
const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());

let db;

connectToDb(function (error) {
    if (!error) {
        app.listen(4000);
        console.log('listening');
        db = getDb(); // Update this line to use getDb() function
    } else {
        console.log(error);
    }
});

// Adding the new entry..
app.post('/add-entry', function (request, response) {
    db.collection('ExpenseData')
    .insertOne(request.body).then(function () {
        response.status(201).json({
            'status': 'data inserted successfully'
        });
    }).catch(function (error) {
        response.status(500).json({
            'error': error
        });
    });
});

// Getting all the data from the database
app.get('/get-data', function (request, response) {
    const entries = [];
    db.collection('ExpenseData')
        .find()
        .forEach(entry => entries.push(entry))
        .then(function () {
            response.status(200).json(entries);
        }).catch(function (error) {
            response.status(500).json({
                'error': error
            });
        });
});

// Deleting the data from the database using the object id
app.delete('/delete-entry/:id', function (request, response) {
    console.log(request.params.id);
    if (ObjectId.isValid(request.params.id)) {
        db.collection('ExpenseData').deleteOne({
            _id: new ObjectId(request.params.id)
        }).then(function () {
            response.status(201).json({
                'status': 'data deleted successfully'
            });
        }).catch(function (error) {
            response.status(500).json({
                'error': error
            });
        });
    } else {
        response.status(500).json({
            'error': 'ObjectId is not valid'
        });
    }
});


// Updating the data in the database
app.patch('/edit-entry', function (request, response) {
    if (ObjectId.isValid(request.body.id)) {
        db.collection('ExpenseData').updateOne(
            { _id: new ObjectId(request.body.id) },
            { $set: request.body.data }
        ).then(function () {
            response.status(201).json({
                'status': 'data updated successfully'
            });
        }).catch(function (error) {
            response.status(500).json({
                'error': error
            });
        });
    } else {
        response.status(500).json({
            'error': 'ObjectId is not valid'
        });
    }
});

