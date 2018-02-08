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

// Data
let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

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
  const lkm = persons.length, date = new Date()
  res.send(`<div>puhelinluettelossa on ${lkm} henkilön tiedot
              <div>${date}</div>
            </div>`)
})

// Tehtävän 3.18 alkua
app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

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

//app.put, tehtävä 3.17

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
