var connectionInstance;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://appuser:password1234@ds151927.mlab.com:51927/heroku_x998qj5q";



module.exports = function(callback) {
    //Check if there is already a connection
    if (connectionInstance) {
        callback(connectionInstance);
        return;
    }

    MongoClient.connect(url, function(err, databaseConnection){
        if (err) throw new Error(err);
        connectionInstance = databaseConnection.db();
        callback(databaseConnection.db());
    });
};

