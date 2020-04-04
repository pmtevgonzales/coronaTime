    
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

const fetch = require('node-fetch')

module.exports = {
    getTimeseriesFromJSON,
    getCountriesFromJSON,
    saveLatestData,
    initialiseCountry
}
//to have the JSON file as object 
function getTimeseriesFromJSON() {
    //this url is the data from Johns Hopkins CSSE regarding COVID-19 that transforms into a json file updated daily.
    let url = "https://pomber.github.io/covid19/timeseries.json"
    let settings = { method: "Get" }
    
    return fetch(url, settings)
        .then(res => res.json())
}

function getCountriesFromJSON() {
    let url = "https://pomber.github.io/covid19/countries.json"
    let settings = { method: "Get" }

    return fetch(url, settings)
        .then(res => res.json())
}

//insert the object from the JSON to the database/sqlite
function saveLatestData(casesByCountry, db = connection) {
    return db('timeseries').del()
    .then(function () {
        casesByCountry.then((c) => {
            var latestData = Object.keys(c)
            latestData.forEach((country) => {
                db('country')
                .where('country', country)
                .first()
                .then((countryRow) => {
                    c[country].forEach ((data) => {
                        //query of the existing if statement??? for stretch
                        db('timeseries').insert({
                            country_id: countryRow.id,
                            case_date: data.date,
                            confirmed_cases: data.confirmed,
                            deaths: data.deaths,
                            recovered: data.recovered
                        })
                        .then()
                    })
                })
            })
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
