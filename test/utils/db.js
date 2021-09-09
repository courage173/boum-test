var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

// Connect to Mongo
MongoClient.connect(url, function (error, client) {
    if (error) throw error;

    // Select database
    var dbo = client.db('demoDatabase');

    // Drop the collection
    dbo.collection('demoCollection').drop(function (err, result) {
        if (err) throw err;
        if (result) console.log('Collection successfully deleted.');
        c.close();
    });
});
