require('dotenv').config()

var app = require('express')()
var cors = require('cors')
var ExpressBrute = require('express-brute')

var store = new ExpressBrute.MemoryStore()
var bruteforce = new ExpressBrute(store)
var getWeather = require('./get-weather')

app.options('/tempo/:city', bruteforce.prevent, cors())
app.get('/tempo/:cidade', bruteforce.prevent, cors(), getWeather)

app.listen(9000)
