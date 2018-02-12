const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan') // logging
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then( () => {
    console.log('connected to database', process.env.MONGODB_URI)
  })
  .catch( err => {
    console.log(err)
  })

mongoose.Promise = global.Promise

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :body - :response-time ms'))
morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})

app.use('', personsRouter)

app.use(middleware.error)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
