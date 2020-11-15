import * as mongo from "mongodb";
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://paepke:Vsc4n2504!@express-cluster.sgb4l.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertAndReadData() {
    try {
        await client.connect()
        const db = client.db("test")
        await db.collection("inventory").deleteMany({})

        const result = await db.collection("inventory").insertOne({
            item:"canvas",
            qty:100,
            tags: ["cotton"],
            size: {h:28, w:35.5, uom:"cm"}
        })

        let results = await db.collection("inventory").find({}).toArray()
        console.log(results)
    } catch (err) {
        console.log("UPPS --->", err)
    }
    finally {
        client.close();
        console.log("Connection Closed")
    }
}


async function connectSetupDataAndGetDB() {
    await client.connect()
    const db = client.db("test")
    await db.collection("inventory").deleteMany({})
    await db.collection('inventory').insertMany([
        { 
            item: "journal",
            qty: 25,
            size: { h: 14, w: 21, uom: "cm" },
            status: "A"
        },
        { 
            item: "notebook",
            qty: 50,
            size: { h: 8.5, w: 11, uom: "in" },
            status: "A"
        },
        { 
            item: "paper",
            qty: 100,
            size: { h: 8.5, w: 11, uom: "in" },
            status: "D"
        },
        { 
            item: "planner",
            qty: 75, size: { h: 22.85, w: 30, uom: "cm" },
            status: "D"
        },
        { 
            item: "postcard",
            qty: 45,
            size: { h: 10, w: 15.25, uom: "cm" },
            status: "A"
        }
      ])
      return db
}
async function readDataWithQueries() {
    try {
        const db = await connectSetupDataAndGetDB();
        let results = await db.collection("inventory").find({status:"D"}).toArray()
        console.log("1st Results:\n",results)
        results = await db.collection("inventory").find({size:{h:14, w:21, uom:"cm"}}).toArray()
        console.log("2nd Results:\n",results)
        results = await db.collection("inventory").find({"size.uom": "in"}).toArray()
        console.log("3rd Results:\n", results)
    } catch (err) {
        console.log("UPPS --->", err)
    }
    finally {
        client.close();
        console.log("Closes connection")
    }
}

async function readDataWithQueriesWithOptions() {
    try {
        const db = await connectSetupDataAndGetDB();
        let results = await db.collection("inventory").find(
            {},
            {
                projection: {_id:0,item:1, qty:1},
                limit: 2,
                sort: {qty:-1}
            }
            ).toArray()
        console.log(results)
    } catch (err) {
        console.log("UPPS --->", err)
    }
    finally {
        client.close();
        console.log("Closes connection")
    }
}

async function readDataWithOperatorsAndCompoundQueries() {
    try {
        const db = await connectSetupDataAndGetDB();
        let results = await db.collection("inventory").find(
            {
                "size.h": {$lt: 15}
            },
            {
                sort: {"size.h":1}
            }
        ).toArray()
        console.log("1st Results:\n",results)

        results = await db.collection("inventory").find(
            {
                status: "A",
                qty: {$lt: 30}
            }
        ).toArray()
        console.log("2nd Results:\n",results)

        results = await db.collection("inventory").find(
            {
                $or: 
                [
                    {status:"A"},
                    {qty: {$gt:30}}
                ]
            }
        ).toArray()
        console.log("3rd Results:\n", results)

    } catch (err) {
        console.log("UPPS --->", err)
    }
    finally {
        client.close();
        console.log("Closes connection")
    }
}
async function updateData() {
    try {
        const db = await connectSetupDataAndGetDB()
        let result = await db.collection("inventory").findOneAndUpdate(
            {
                item:"paper"
            },
            {
                $set: {
                    "size.uom": "cm",
                    status: "P"
                },
                $currentDate: {
                    lastModified: true
                }
            },
            {
                returnOriginal:false
            }
        )
        console.log("1st. Updated Result:\n", result)

        let updateMany = await db.collection("inventory").updateMany(
            {
                qty: {$lt: 50}
            },
            {
                $set: {
                    "size.uom": "cm",
                    status: "P"
                },
                $currentDate: {
                    lastModified: true
                }
            }
        )
        console.log("Update Many\n")
        console.log(updateMany.result)
        console.log(updateMany.modifiedCount)
        console.log(updateMany.matchedCount )
    } catch (err) {
        console.log("UPPS --->", err)
    }
    finally {
        client.close();
        console.log("Closes connection")
    }

}
async function deleteData() {
    try {
        const db = await connectSetupDataAndGetDB();
        let result = await db.collection("inventory").findOneAndDelete({status:"D"})
        console.log("Single deleted result:\n", result.value)

        let deleteMany = await db.collection("inventory").deleteMany(
            {status:"P"}
        )
        console.log("Many deleted results:\n", deleteMany.result)
    } catch (err) {
        console.log("UPPS --->", err)
    }
    finally {
        client.close();
        console.log("Closes connection")
    }
}
// insertAndReadData()
// readDataWithQueries()
// readDataWithQueriesWithOptions()
// readDataWithOperatorsAndCompoundQueries()
// updateData()
deleteData()