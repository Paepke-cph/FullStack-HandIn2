
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://paepke:Vsc4n2504!@express-cluster.sgb4l.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function MongoTest() {
    try {
        await client.connect()
        const dogs = client.db("kennel")
        const dogCollection = dogs.collection("dogs")
        // await dogCollection.insertMany([{name:"Fido"},{name:"King"},{name:"Prince", race:"Labrador"}])
        const allDogs = await dogCollection.find({}).toArray()
        console.log(allDogs)
    } catch (error) {
        console.log(error)
    } finally {
        client.close()
    }
}

MongoTest()