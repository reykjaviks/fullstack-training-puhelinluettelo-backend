const mongoose = require('mongoose')
const url = 'mongodb://fullstack:<>@ds229008.mlab.com:29008/puhelinluettelo-persons'
mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

Person.format = function(person) {
  const formattedPerson = { ...person._doc, id: person._id}
  delete formattedPerson._id
  delete formattedPerson.__v
  return formattedPerson
}

module.exports = Person
