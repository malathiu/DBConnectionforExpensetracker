const {MongoClient}=require('mongodb');
let db;

function connectToDb(startServer){
    MongoClient.connect('mongodb+srv://yokesh:malathi@cluster0.hnfytot.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then(function(client){  //its a async function so using .then
        db=client.db();
        return startServer();
    }).catch(function(error){
        return startServer(error)
    });   //this is used for connecting to the database 
}

function getDb(){
    return db;
    // console.log(db);
}

module.exports={connectToDb,getDb};