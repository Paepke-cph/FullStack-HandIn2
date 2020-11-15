import express from "express"
import userFacade from '../facades/userFacade'
import Joi from 'joi'

const router = express.Router();


router.get('/', (req,res) => {
    return res.json(userFacade.getAllUsers())
})
  
router.get('/:userName', (req,res) => {
    if(req.params.userName) {
        try {
        let user = userFacade.getUser(req.params.userName)
        return res.json(user)
        } catch {
        return res.status(404).json({msg:"User not found!"})
        }
    } else {
        return res.status(400).json({msg:"UserName may not be empty"})
    }
})
  
router.post('/', (req,res) => {
    const scheme = Joi.object({
        name: Joi.string().required(),
        userName: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    })

    const {error} = scheme.validate(req.body)
    if(error) {
      return res.status(400).json(error.details[0].message)
    } else {
      let success = userFacade.addUser(req.body)
      try {
        let newUser = userFacade.getUser(req.body.userName)
        return success ? res.status(200).json(newUser) : res.status(400).json({msg:"User could not be added"})
      } catch {
        return res.status(400).json({msg:"Something went wrong in creation of user"})
      }
    }
})
  
router.delete('/:userName', (req,res) => {
    let userName = req.params.userName
    if(userName) {
      let success = userFacade.deleteUser(userName)
      return success ? res.json({msg:"User deleted"}) : res.status(404).json({msg:"User was not found"})
    } else {
        return res.status(400).json({msg:"UserName may not be empty"})
    }
})

module.exports = router