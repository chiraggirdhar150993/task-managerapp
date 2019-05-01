const {
    MongoClient,
    ObjectID
} = require('mongodb');
const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, {
    useNewUrlParser: true
}, (error, client) => {

    if (error) {
        return console.log('unable to connect to database');
    }

    console.log('connnected successfully');
    const db = client.db(databaseName);
    db.collection('task-manager').deleteOne({
        desciption: 'to do 2'
    }).then((result) => {
        console.log(result.deletedCount);
    }).catch((error) => {
        console.log(error);
    });

});

// CRUD operation
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
// ObjectID 12 byte unique id, 3 byte unix timestamp , 5 byte random value, 4 byte random value 
// with sequence of first // binary data
// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());
// console.log(id.id.length); // 12 in form of binary data
// console.log(id.toHexString().length); // 24 thats why binary id is used

// db.collection('task-manager').insertOne({
//     _id: id,desciption :'to do 1', completed: true
// });
/*     db.collection('task-manager').insertMany([
        { desciption :'to do 1', completed: true},
        { desciption :'to do 2', completed: true},
        { desciption :'to do 3', completed: false}
    ], (error, result) => {
        if(error) {
           return console.log('unable to insert document');
        }

        console.log(result.insertedCount);
        console.log(result.ops);
    }) */

   /* db.collection('task-manager').find({
        desciption: 'to do 1'
    }).toArray((error, result) => {
        if (error) {
            return console.log('unable to find this task');
        }

        console.log(result);
    });

db.collection('task-manager').find({
    desciption: 'to do 1'
}).count((error, count) => {
    console.log(count);

}); */

/* db.collection('task-manager').findOne({
    _id: new ObjectID("5ca90e3ce4be2926e84f2c53")
}, (error, result) => {
    if( error) return console.log('unable to fetch data');
    console.log(result);
});
db.collection('task-manager').find({ completed: false}).toArray((error, result) => {
    if( error) return console.log('unable to fetch records');
    console.log(result);
}); */



/* db.collection('task-manager').updateMany({
    completed: false
}, {
    $set: {
        completed: true
    }
}).then((result) => {
    console.log(result.matchedCount);
}).catch((error) => {
    console.log(error);
}); */

/*     db.collection('task-manager').updateOne({
        desciption : 'to do 1'
    }, {
        $set: {
            completed: false
        }
    }).then((result) => {
        console.log(result.matchedCount);
    }).catch((error) => {
        console.log('eeror comes');
    })  */