const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://fullstack:sekred@ds229008.mlab.com:29008/puhelinluettelo-persons'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})

hasParams = (process) => {
  if (process.argv.length > 3) return true
  return false
}

if (hasParams(process)) {
  person
  .save()
  .then(response => {
    console.log(`Lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
    mongoose.connection.close()
  })
} else {
    Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
