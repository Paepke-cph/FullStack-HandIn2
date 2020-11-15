import path from "path";
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const debug = require("debug")("db-setup");
import { MongoClient } from "mongodb";
import { UV_FS_O_FILEMAP } from "constants";

const connection = process.env.CONNECTION || ""
let client
let isConnected = false;

async function makeConnection() {
    if(!client) {
        client = new MongoClient(connection, { useNewUrlParser: true, useUnifiedTopology: true })
    }
    if(!client.isConnected()) {
        client = await client.connect()
        isConnected = true
        debug("--------- DB Connected ---------")
    }
}

export function getConnectedClient() {
    if(isConnected) {
        return client
    }
    else {
        makeConnection()
        return client
    }
}
export async function closeConnection() {
  if (isConnected) {
    await client.close();
    isConnected = false;
    debug("--------- DB Connection Closed ---------")
  }
}

