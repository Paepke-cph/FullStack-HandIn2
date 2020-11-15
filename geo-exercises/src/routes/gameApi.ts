import express from "express";
const router = express.Router();
import * as mongo from "mongodb"
import authMiddleware from "../middleware/basic-auth";
import UserFacade from '../facades/userFacadeWithDB'
import GameFacade from '../facades/gameFacade'
import {getConnectedClient, closeConnection} from '../config/setupDB'
const MongoClient = mongo.MongoClient;
const gju = require ( 'geojson-utils' );
import {gameArea,players} from '../areas/gameData' 

const USE_AUTHENTICATION = process.env["SKIP_AUTHENTICATION"] === 'False';
let dbInitialized = false;

(async function initDb() {
    const client = await getConnectedClient();
    await UserFacade.initDB(client);
    await GameFacade.initDB(client);
    dbInitialized = true
  })()

/**
 * Converts the two number (Lon & Lat) to a Point object.
 * @param lon Longtitude
 * @param lat Latitude
 */
const toPoint = (lon:number,lat:number) => {
    return {
        "type":"Point",
        "coordinates":[lon,lat]
    }
} 

/**
 * Finds all nearby players within a given radius from a center.
 * @param center The center of the search
 * @param radius The radius from the center of the search
 */
// const nearbyPlayers = (center:object, radius = 1000)=> {
//     let nearbyPlayers:object[] = []
//     for (var p = 0; p < players.length; p++) {
//         if(gju.geometryWithinRadius(players[p].geometry,center,radius)){
//             nearbyPlayers.push(players[p])
//         }
//     }
//     return nearbyPlayers
// }

// Check whether the player is inside the area or not
// Not currently implemented with a database
// router.post('/isIn', async (req,res,next) => {
//     try {     
//         let position = toPoint(req.body.lon,req.body.lat)
//         let result = gju.pointInPolygon(position,gameArea)
//         let message = result 
//             ? "The Point was inside the GameArea"
//             : "The Point was not inside the GameArea"
//         res.json({"isIn":result, msg:message})
//     } catch (error) {
//         next(error)
//     }
// })



if (USE_AUTHENTICATION) {
    router.use(authMiddleware)
}
/**
 * Gets all nearby players, excluding the asking player
 */
router.post('/nearbyPlayers', async (req,res,next) => {
    try {
        let username = req.body.username
        let password = req.body.password
        let lon = req.body.lon
        let lat = req.body.lat
        let distance = req.body.distance
        let players = await GameFacade.nearbyPlayers(username,password,lon,lat,distance)
        res.json({"players":players})
    } catch(error) {
        next(error)
    }
})

/**
 * Get a post by id, if lat/lon is within range.
 */
router.post('/getPostIfReached', async (req,res,next) => {
    try {
        let postID = req.body.postID
        let lat = req.body.lat
        let lon = req.body.lon
        let result = await GameFacade.getPostIfReached(postID,lat,lon)
        res.json(result)
    } catch(error) {
        next(error)
    }
})

router.post('/updatePosition', async (req,res,next) => {
    try {
        let username = req.body.username
        let password = req.body.password
        let lat = req.body.lat
        let lon = req.body.lon
        await GameFacade.updatePosition(username,password,lon,lat)
        res.json({"msg":"Position has been updated"})
    } catch(error) {
        next(error)
    }
})

/**
 * Not implemented with a DB yet.
 */
// router.post('/closestPlayer', async (req,res,next) => {
//     try {
//         let position = toPoint(req.body.lon,req.body.lat)
//         var otherPlayers = req.body.radius !== undefined 
//             ? nearbyPlayers(position, req.body.radius)
//             : nearbyPlayers(position)
//         let closestPlayer = {}
//         let bestDistance = Number.MAX_VALUE
//         otherPlayers.forEach((player) => {
//             var distance = gju.pointDistance(position,player['geometry'])
//             if(distance < bestDistance) {
//                 closestPlayer = player
//                 bestDistance = distance
//             }
//         })
//         res.json({player:closestPlayer, distance:bestDistance})
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = router;