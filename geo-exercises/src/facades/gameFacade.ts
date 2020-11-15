const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import IPoint from '../interfaces/Point';
import * as mongo from "mongodb"
import { ApiError } from "../errors/apiError"
import UserFacade from "./userFacadeWithDB"
import IPosition from '../interfaces/Position';
import IPost from '../interfaces/Post';
import { positionCreator } from "../utils/geoUtils"
import { POSITION_COLLECTION, POST_COLLECTION } from "../config/dbCollections"
const debug = require("debug")("game-facade");
let positionCollection: mongo.Collection;
let postCollection: mongo.Collection;
const EXPIRES_AFTER = 30;

export default class GameFacade {

  static readonly DIST_TO_CENTER = 15
  static dbIsReady = false;

  static isDbReady() {
    if (!GameFacade.dbIsReady) {
      throw new Error(`######## initDB MUST be called BEFORE using this facade ########`)
    }
  }

  static async initDB(client: mongo.MongoClient) {
    const dbName = process.env.DB_NAME;
    debug(`Database ${dbName} about to be setup: ${client}`)
    if (!dbName) {
      throw new Error("Database name not provided")
    }
    try {
      positionCollection = await client.db(dbName).collection(POSITION_COLLECTION);
      debug(`positionCollection initialized on database '${dbName}'`)

    } catch (err) {
      console.error("Could not create connection", err)
    }

    positionCollection.createIndex({"lastUpdated":1}, {expireAfterSeconds:EXPIRES_AFTER})
    positionCollection.createIndex({location:"2dsphere"})

    postCollection = client.db(dbName).collection(POST_COLLECTION);
    await postCollection.createIndex({ location: "2dsphere" })

    GameFacade.dbIsReady = true;
  }


  static async updatePosition(username:string, password:string,longitude:number,latitude:number) {
    GameFacade.isDbReady();
    let user;
    try {
      let userFound = await UserFacade.checkUser(username,password)
      user = UserFacade.getUser(username)
    } catch(error) {
      throw new ApiError("Wrong username or password", 403)
    }
    try {
      const point = { type: "Point", coordinates: [longitude, latitude] }
      const date = new Date();

      await positionCollection.findOneAndUpdate(
        {"username":username},
        { $set: {
            "location":point, "lastUpdated":date 
        }},
        { upsert: true, returnOriginal: false }
      )
    } catch(error) {
      throw error
    }
  }

  static async getPosition(username:string, password:string) {
    GameFacade.isDbReady();
    let user;
    try {
      let userFound = await UserFacade.checkUser(username,password)
      user = UserFacade.getUser(username)

      let position = await positionCollection.findOne({
        username:username,
      })
      return position;
    } catch(error) {
      throw new ApiError("Wrong username or password", 403)
    }
  }

  static async nearbyPlayers(username: string, password: string, longitude: number, latitude: number, distance: number) {
    GameFacade.isDbReady();
    try {
      this.updatePosition(username,password,longitude,latitude)
      const point = { type: "Point", coordinates: [longitude, latitude] }
      const nearbyPlayers = await GameFacade.findNearbyPlayers(username, point, distance);
      if(nearbyPlayers.length == 0) {
        return[]
      } else {
        const formatted = nearbyPlayers.map((player) => {
          return {
            username: player.username,
            lon: player.location.coordinates[0],
            lat: player.location.coordinates[1]
          }
        })
        return formatted
        }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find all nearby Teams, excluding the asking Team
   * @param clientUserName The name of the team
   * @param point Position of the asking Team
   * @param distance The search distance.
   */
  static async findNearbyPlayers(clientUserName: string, point: IPoint, distance: number): Promise<Array<IPosition>> {
    GameFacade.isDbReady();
    try {
      const found = await positionCollection.find(
        {
            username: {$ne: clientUserName},
            location: {
                $near: point,
                $maxDistance: distance    
            }
        }
      )
      return found.toArray();
    } catch (err) {
      throw err;
    }
  }

  static async getPostIfReached(postID: string, lat: number, lon: number): Promise<any> {
    GameFacade.isDbReady();
    const point = { type: "Point", coordinates: [lon, lat] }
    try {
      const post: IPost | null = await postCollection.findOne(
        {
          _id: postID,
          location:
          {
            $near: point,
            $maxDistance: GameFacade.DIST_TO_CENTER
          }
        }
      )
      if (post === null) {
        throw new ApiError("Post not reached", 400);
      }
      return { postID: post._id, task: post.task.text, isUrl: post.task.isUrl };
    } catch (err) {
      throw err;
    }
  }

  static async addPost(
    name: string,
    taskTxt: string,
    isURL: boolean,
    taskSolution: string,
    lon: number,
    lat: number
  ): Promise<IPost> {
    GameFacade.isDbReady();
    const position = { type: "Point", coordinates: [lon, lat] };
    const status = await postCollection.insertOne({
      _id: name,
      task: { text: taskTxt, isURL },
      taskSolution,
      location: {
        type: "Point",
        coordinates: [lon, lat]
      }
    });
    const newPost: any = status.ops;
    return newPost as IPost
  }
}