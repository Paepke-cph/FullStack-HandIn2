const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const debug = require("debug")("facade-with-db")
import IGameUser from '../interfaces/GameUser'
import { bryptAsync, bryptCheckAsync } from "../utils/bcrypt-async-helper"
import * as mongo from "mongodb"
import { getConnectedClient, closeConnection } from "../config/setupDB"
import { ApiError } from "../errors/apiError"
