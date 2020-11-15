const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const debug = require("debug")("facade-with-db");
import IGameUser from '../interfaces/GameUser';
import { bryptAsync, bryptCheckAsync } from "../utils/bcrypt-async-helper"
import * as mongo from "mongodb"
import { getConnectedClient, closeConnection } from "../config/setupDB"
import { ApiError } from "../errors/apiError"

let userCollection: mongo.Collection;

export default class UserFacade {

  static dbIsReady = false;

  static async initDB(client: mongo.MongoClient) {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      throw new Error("Database name not provided")
    }
    try {
      userCollection = await client.db(dbName).collection("users");
      debug(`userCollection initialized on database '${dbName}'`)

    } catch (err) {
      debug("Could not create connection", err)
    }
    UserFacade.dbIsReady = true
  }

  static isDbReady() {
    if (!UserFacade.dbIsReady) {
      throw new Error(`######## initDB MUST be called BEFORE using this facade ########`)
    }
  }

  static async addUser(user: IGameUser): Promise<string> {
    UserFacade.isDbReady()
    const hash = await bryptAsync(user.password);
    let newUser = { ...user, password: hash }
    const result = await userCollection.insertOne(newUser);
    return "User was added";
  }

  static async deleteUser(username: string): Promise<string> {
    UserFacade.isDbReady()
    const status = await userCollection.deleteOne({ username })
    if (status.deletedCount === 1) {
      return "User was deleted"
    }
    throw new ApiError("User could not be deleted", 400);
  }
  static async getAllUsers(proj?: object): Promise<Array<any>> {
    UserFacade.isDbReady()
    const users = await userCollection.find(
      {},
      { projection: proj }).toArray()

    return users;
  }

  static async getUser(username: string, proj?: object): Promise<any> {
    UserFacade.isDbReady()
    const user = await userCollection.findOne({ username:username });
    return user;
  }

  static async checkUser(username: string, password: string): Promise<boolean> {
    UserFacade.isDbReady()
    let userPassword = "";
    let user;
    user = await UserFacade.getUser(username);
    if (user == null) {
      return Promise.reject(false);
    }
    userPassword = user.password;
    const status = await bryptCheckAsync(password, userPassword);
    return status
  }
}