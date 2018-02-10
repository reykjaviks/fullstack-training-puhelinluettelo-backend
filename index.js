const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// Database handling
const mongoose = require('mongoose')
const url = 'mongodb://fullstack:<>@ds229008.mlab.com:29008/puhelinluettelo-persons'
mongoose.connect(url)

const generateId = () => Math.floor(Math.random() * 10000)

// Middleware
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :body - :response-time ms'))
morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
})
app.use(cors())

// Endpoints
app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelon backend</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(people => {
      res.send(`<div>puhelinluettelossa on ${people.length} henkilön tiedot
                  <div>${new Date()}</div>
                </div>`)
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error: 'error retrieving numbers' })
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(404).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
