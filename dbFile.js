    
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

const fetch = require('node-fetch')

module.exports = {
    getLatestData,
    getCountries,
    saveLatestData,
    initialiseCountry
}

function getLatestData() {
    //this url is the data from Johns Hopkins CSSE regarding COVID-19 that transforms into a json file updated daily.
    let url = "https://pomber.github.io/covid19/timeseries.json"
    let settings = { method: "Get" }
    
    return fetch(url, settings)
        .then(res => res.json())
}

function getCountries() {
    let url = "https://pomber.github.io/covid19/countries.json"
    let settings = { method: "Get" }

    return fetch(url, settings)
        .then(res => res.json())
        // .then((json) => {

        // })
}

function saveLatestData(casesByCountry) {
    casesByCountry.then((c) => {
        var countries = Object.keys(c)
        countries.forEach((country) => {
            console.log(country)
        }) 
    })
}

function initialiseCountry(db = connection) {
    return db('country').del()
    .then(function () {
        getCountries().then((c) => {
            var countries = Object.keys(c)
            countries.forEach((country) => {
                db('country').insert({
                    country: country,
                    flag: c[country].flag,
                    code: c[country].code
                })
                .then()
            })
        })
    })
}

initialiseCountry()
// var latestData = getLatestData()

// saveLatestData(latestData)
