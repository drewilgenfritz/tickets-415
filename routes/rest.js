var express = require('express');
var router = express.Router();
var mongodb =require('mongodb');
var db = require('./DBconnect');
var parser = require('xml2json');
var fs = require('fs');

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
        databaseConnection.collection("tickets").find(query).toArray( function(error, results) {
                if (!results[0]) {
                    res.send("No ticket exists.")
                } else {
                    console.log(results);
                    //console.log(error);
                    ticket = {
                        id: results[0].id,
                        createdat: results[0].createdat,
                        updatedat: results[0].updatedat,
                        type: results[0].type,
                        subject: results[0].subject,
                        description: results[0].description,
                        priority: results[0].priority,
                        status: results[0].status,
                        recipient: results[0].recipient,
                        submitter: results[0].submitter,
                        assignee_id: results[0].assignee_id,
                        follower_id: results[0].follower_id,
                        tags: results[0].tags
                    };
                    //console.log(ticket);
                    res.redirect('/rest/xml/ticket/' + req.params.id);

                }
        });

    });

});

router.put('/ticket/:id', function (req,res){
    var query = {id: req.params.id};

    db(function (databaseConnection) {
        databaseConnection.collection("tickets").find(query).toArray(function (err, results) {
            console.log(err);
            //var token = results[0].id;
            //FINALLY This error handling works. the result is an array. DUH!!!
            if (!results[0]) {
                db(function (databaseConnection) {
                    databaseConnection.collection("tickets").insertOne(ticket, function (error, results) {
                        res.send(ticket).end();
                        //console.log(results);
                    });
                });
            } else {
                ticket = {
                    $set: {
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
                    }
                };
                db(function (databaseConnection) {
                    databaseConnection.collection("tickets").updateOne(query, ticket, function (error, results) {
                        res.send(results);
                    });
                });
            }
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
    db(function (databaseConnection) {
        databaseConnection.collection("tickets").find(ticketid).toArray(function (err,results) {
            console.log(err);
            //var token = results[0].id;
            //FINALLY This error handling works. the result is an array. DUH!!!
            if(results[0]){
                console.log(results[0]);
                res.send("ticket already exists");
            }else{
                db(function(databaseConnection) {
                    databaseConnection.collection("tickets").insertOne(ticket, function(error, results) {
                        res.send(ticket).end();
                        //console.log(results);
                    });
                });

            }
        })
    });
});

router.get('/xml/ticket/:id', function (req, res) {
    var json = { ticket:
            { id: { $t: ticket.id },
                created_at: { $t: ticket.createdat },
                updated_at: { $t: ticket.updatedat },
                type: { $t: ticket.type },
                subject: { $t: ticket.subject },
                description: { $t: ticket.description },
                priority: { $t: ticket.priority },
                status: { $t: ticket.status },
                recipient: { $t: ticket.recipient },
                submitter: { $t: ticket.submitter },
                assignee_id: { $t: ticket.assignee_id },
                follower_ids: {$t:ticket.follower_id },
                tags: { $t: ticket.tags } }
    };
    var stringified = JSON.stringify(json);
    var xml = parser.toXml(stringified);
    fs.writeFile('./tickets1.xml', xml, function (err, data) {
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }

    });
    res.send(xml);
});

router.put('/xml/ticket/:id', function (req, res) {
    fs.readFile('./tickets.xml', function (err, data) {
        var json = JSON.parse(parser.toJson(data, {reversible: true}));
        console.log(json);
        console.log(json.ticket.id.$t)
        ticket = {
            id: json.ticket.id.$t,
            createdat: json.ticket.created_at.$t,
            updatedat: json.ticket.updated_at.$t,
            type: json.ticket.type.$t,
            subject: json.ticket.subject.$t,
            description: json.ticket.description.$t,
            priority: json.ticket.priority.$t,
            status: json.ticket.status.$t,
            recipient: json.ticket.recipient.$t,
            submitter: json.ticket.submitter.$t,
            assignee_id: json.ticket.assignee_id.$t,
            follower_ids:json.ticket.follower_ids.$t,
            tags: json.ticket.tags.$t
        }
        console.log(ticket);
        res.redirect(307, '/rest/ticket/' +req.params.id);
    })

});
module.exports = router;
