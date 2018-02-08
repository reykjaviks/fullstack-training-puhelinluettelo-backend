const mongoose = require('mongoose')
const url = 'mongodb://fullstack:<>@ds229008.mlab.com:29008/puhelinluettelo-persons'
mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
