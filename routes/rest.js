var express = require('express');
var router = express.Router();

var myArray = [];
var ticket;

router.get('/list', function(req, res) {
    //send my whole array
    res.send(myArray);
});

router.get('/ticket/:id', function (req, res) {
    for(let i = 0; i<myArray.length, i++;){
        //Loop to match ids to array indexes
        if (myArray[i].id === req.params.id){
            ticket = myArray[i];
            res.send(ticket);
        }

    }
    res.send(ticket);
});

router.post('/ticket', function (req, res)   {
    console.log(req.body);
    console.log(res.body);
    //Create my object.
    ticket =   {
        id: req.body.id,
        createdat: req.body.createdat,
        updatedat: req.body.updatedat,
        type: req.body.type,
        subject: req.body.subject
    };
    //Push my object onto the end of my Array
    myArray.push(ticket);
    console.log(ticket);
    console.log(myArray);
    //Send my ticket back.
    res.json(ticket);
});
module.exports = router;
