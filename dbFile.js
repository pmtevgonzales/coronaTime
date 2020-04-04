    
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

const fetch = require('node-fetch')

module.exports = {
    getLatestData,
    getCountries,
    saveLatestData
}

function getLatestData() {
    //this url is the data from Johns Hopkins CSSE regarding COVID-19 that transforms into a json file updated daily.
    let url = "https://pomber.github.io/covid19/timeseries.json"
    let settings = { method: "Get" }
    // let result = null
    
    return fetch(url, settings)
        .then(res => res.json())

        // .then((json) => {
        //     result = json
        //     // json["New Zealand"].forEach(({ date, confirmed, recovered, deaths }) => 
        //     // console.log(`${date} active cases: ${confirmed - recovered - deaths}`)
        //     // )
        // })
        // return result
}

function getCountries() {
    let url = "https://pomber.github.io/covid19/countries.json"
    let settings = { method: "Get" }

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            var country = Object.values(json)
            country.forEach((c) => {
                console.log(c)
            })
        })
}

function saveLatestData(casesByCountry) {
    casesByCountry.then((c) => {
        var countries = Object.keys(c)
        countries.forEach((country) => {
            console.log(country)
        }) 
    })
}

var latestData = getLatestData()

saveLatestData(latestData)
