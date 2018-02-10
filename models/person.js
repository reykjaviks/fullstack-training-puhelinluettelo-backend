const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)
mongoose.Promise = global.Promise

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
