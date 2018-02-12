const personsRouter = require('express').Router()
const Person = require('../models/person')

// Endpoints
personsRouter.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelon backend</h1>')
})

personsRouter.get('/info', (req, res) => {
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

personsRouter.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      res.status(400).send({ error: 'client error' })
    })
})

personsRouter.get('/api/persons/:id', (req, res) => {
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

personsRouter.post('/api/persons', (req, res) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then(Person.format)
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson)
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'client error'})
    })
})

personsRouter.put('/api/persons/:id', (req, res) => {
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

personsRouter.delete('/api/persons/:id', (req, res) => {
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

module.exports = personsRouter
