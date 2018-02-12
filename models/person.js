const mongoose = require('mongoose')

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
