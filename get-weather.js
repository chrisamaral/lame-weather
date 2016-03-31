var fetch = require('node-fetch')

var unknownWeather = {
  cidade: 'Desconhecida',
  tempo: 'Nunca se sabe',
  temperatura: 0,
  latitude: 0,
  longitude: 0,
  humidade: '0%',
  url_referencia: 'https://google.com',
  icone: 'http://www.lagardedenuit.com/wiki/images/8/87/Interrogation.png'
}

function toJSON (response) {
  if (response.status === 204 || typeof response.json !== 'function') return response

  return response.json()
    .then(function (data) {
      response.data = data
      return response
    })
}

function checkStatus (response) {
  return response.ok ? response : Promise.reject(response)
}

function fetchWeather (cidade) {
  var weatherUrl = 'http://api.wunderground.com/api/' +
    process.env.WUNDERGROUND_SECRET +
    '/conditions/lang:BR/q/BR/' +
    cidade + ' .json'

  return fetch(weatherUrl)
    .then(toJSON)
    .then(checkStatus)
    .then(function (response) {
      if (!response.data || !response.data.current_observation) {
        var e = new Error('Erro ao buscar a localização')
        e.data = response.data
      }

      var w = response.data.current_observation

      return {
        cidade: w.display_location.city,
        tempo: w.weather,
        temperatura: w.temp_c,
        latitude: Number(w.display_location.latitude),
        longitude: Number(w.display_location.longitude),
        humidade: w.relative_humidity,
        url_referencia: w.forecast_url,
        icone: w.icon_url
      }
    })
}


function getWeather (req, res) {
  fetchWeather(req.params.cidade)
    .then(function (weather) {
      res.json(weather)
    })
    .catch(function (e) {
      console.log(e)
      res.json(unknownWeather)
    })
}

module.exports = getWeather
