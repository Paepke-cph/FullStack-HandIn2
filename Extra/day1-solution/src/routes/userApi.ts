import express from "express";
import userFacade from "../facades/user";

const router = express.Router();

router.post('/', async function (req, res, next) {
  try{
    let newUser = req.body;
    newUser.role = "user";  //Even if a hacker tried to "sneak" in his own role, this is what you get
    const status = await userFacade.addUser(newUser)
    res.json({status})
  } catch (err){
    next(err);
  }
})

router.get('/:userName', async function (req, res, next) {
  try {
  const user_Name = req.params.userName;
  const user = await userFacade.getUser(user_Name);
  const { name, userName } = user;
  const userDTO = { name, userName }
  res.json(userDTO);
  } catch(err){
    next(err)
  }
});

router.get('/', async function (req, res, next) {
  try {
    const users = await userFacade.getAllUsers();
    const usersDTO = users.map((user) => { 
      const { name, userName } = user;
      return {name,userName}
    })
    res.json(usersDTO);
  } catch (err) {
    next(err)
  }
});

router.delete('/:userName', async function (req, res, next) {
  try{
    const user_name = req.params.userName;
    const status = await userFacade.deleteUser(user_name)
    res.json({status})
  } catch (err){
    next(err);
  }
})

module.exports = router;