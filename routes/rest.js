var express = require('express');
var router = express.Router();
var mongodb =require('mongodb');
var db = require('./DBconnect');

var myArray = [];
var ticket;

router.get('/list', function(req, res) {
    //send my whole array
    db(function(databaseConnection) {
        databaseConnection.collection("tickets").find({}).toArray(function(error, results) {
            res.send(results);
        });
    });

});

router.get('/ticket/:id', function (req, res) {
    /*for(let i = 0; i<myArray.length, i++;){
        //Loop to match ids to array indexes
        if (myArray[i].id === req.params.id){
            ticket = myArray[i];
            res.send(ticket);
        }else{
            res.send("Ticket does not exist.");
        }
    }*/
    var query = {id: req.params.id};
    db(function(databaseConnection) {
        databaseConnection.collection("tickets").find(query).toArray(function(error, results) {
            res.send(results);
        });
    });

});

router.put('/ticket/:id', function (req,res){
    var query = {id: req.params.id};
    ticket =   { $set: {
            id: req.body.id,
            createdat: req.body.createdat,
            updatedat: req.body.updatedat,
            type: req.body.type,
            subject: req.body.subject,
            description: req.body.description,
            priority: req.body.priority,
            status: req.body.status,
            recipient: req.body.recipient,
            submitter: req.body.submitter,
            assignee_id: req.body.assignee_id,
            follower_id: req.body.follower_id,
            tags: req.body.tags
        }};
    db(function(databaseConnection) {
        databaseConnection.collection("tickets").updateOne(query, ticket, function(error, results) {
            res.send(results);
        });
    });
});

router.delete('/ticket/:id', function (req,res) {
   var query = {id: req.params.id};
    db(function(databaseConnection) {
        databaseConnection.collection("tickets").deleteOne(query, function(error, results) {
            console.log("ticket deleted");
            res.send(results);
        });
    });
});

router.post('/ticket', function (req, res)   {
    // console.log(req.body);
    //console.log(res.body);
    //Create my object.
    ticket =   {
        id: req.body.id,
        createdat: req.body.createdat,
        updatedat: req.body.updatedat,
        type: req.body.type,
        subject: req.body.subject,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        recipient: req.body.recipient,
        submitter: req.body.submitter,
        assignee_id: req.body.assignee_id,
        follower_id: req.body.follower_id,
        tags: req.body.tags
    };


            //Push my object onto the end of my Array
            //myArray.push(ticket);
    var ticketid = {id: req.body.id};
    /*db(function (databaseConnection) {
        databaseConnection.collection("tickets").find(ticketid).toArray(function (err,results) {
            console.log(err);
            //var token = results[0].id;
            if(!results){
                console.log(results);
                res.send("ticket already exists");
            }else{
                db(function(databaseConnection) {
                    databaseConnection.collection("tickets").insertOne(ticket, function(error, results) {
                        res.send(ticket).end();
                        //console.log(results);
                    });
                });

            }
        })*/
    db(function(databaseConnection) {
        databaseConnection.collection("tickets").insertOne(ticket, function(error, results) {
            res.send(ticket).end();
            //console.log(results);
        });

    });
            //console.log(ticket);
            //console.log(myArray);
            //Send my ticket back.



});
module.exports = router;
