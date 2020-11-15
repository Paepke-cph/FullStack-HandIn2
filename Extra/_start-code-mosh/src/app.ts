require('dotenv').config();
import express from "express"
const Joi = require('joi')
import path from "path";
const app = express();

app.use(express.json())

const courses = [
  {id: 1, name: "Math"},
  {id: 2, name: "English"},
  {id: 3, name: "Danish"},
];

app.get("/api/dummy", (req, res) => {
  return res.json({ msg: "Hello There" })
})

app.get('/api/courses', (req,res) => {
  return res.json(courses)
})

app.get('/api/courses/:id', (req,res) => {
  const course = courses.find( c => c.id === parseInt(req.params.id))
  if(!course) return res.status(404).json({msg: "Course was not found!"})
  else return res.json(course)
})

app.post('/api/courses', (req,res) => {

  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })


  const {error} = schema.validate(req.body)

  if(error) {
    return res.status(400).json(error.details[0].message)
  } else {
    const course = {
      id: courses.length + 1,
      name: req.body.name
    }
    courses.push(course)
    return res.json(course)
  }
})


const PORT = process.env.PORT || 3333;
const server = app.listen(PORT)
console.log(`Server started, listening on port: ${PORT}`)
module.exports.server = server;


