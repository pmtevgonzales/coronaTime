    
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

const fetch = require('node-fetch')

module.exports = {
    getTimeseriesFromJSON,
    getCountriesFromJSON,
    saveLatestData,
    initialiseCountry,
    getGlobalData,
    selectCountryDrop,
    selectCountryData
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
    return casesByCountry.then((c) => {
        let latestData = Object.keys(c)
        latestData.forEach((country) => {
            db('timeseries')
            .join('country', 'timeseries.country_id', 'country.id')
            .where('country.country', country)
            .select('case_date as caseDate', 'country')
            .then((currentData) => {
                let casesToAdd = c[country].filter((caseData) => {
                    return !currentData.some((entry) => {
                        return entry.caseDate == caseData.date && country == entry.country
                    })
                })

                db('country')
                .where('country', country)
                .first()
                .then((countryRow) => {
                    let countryID = countryRow !== undefined ? countryRow.id: 0

                    if(countryID != 0) {
                        casesToAdd.forEach((data) => {
                            db('timeseries').insert({
                                country_id: countryID,
                                case_date: data.date,
                                confirmed_cases: data.confirmed,
                                deaths: data.deaths,
                                recovered: data.recovered
                                })
                                .then((id) => {
                                    console.log('id ' + id + ' with ' + data.date + ' added for ' + country)
                                })
                                .catch ((err) => {
                                    console.error(err)
                                })
                        })
                    }
                })
            }) 
        })
    })
}

//WORKING CODE!!!!!!!
// function saveLatestData(casesByCountry, db = connection) {
//     return db('timeseries').del()
//     .then(function () {
//         casesByCountry.then((c) => {
//             var latestData = Object.keys(c)
//             latestData.forEach((country) => {
//                 db('country')
//                 .where('country', country)
//                 .first()
//                 .then((countryRow) => {
//                     c[country].forEach ((data) => {
//                         //query of the existing if statement??? for stretch
//                         db('timeseries').insert({
//                             country_id: countryRow.id,
//                             case_date: data.date,
//                             confirmed_cases: data.confirmed,
//                             deaths: data.deaths,
//                             recovered: data.recovered
//                         })
//                         .then()
//                     })
//                 })
//             })
//         })
//     })
// }

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

function getGlobalData(db = connection) {
    return db('timeseries')
    .select('case_date as caseDate',db.raw('SUM(confirmed_cases) as confirmedCases'),db.raw('SUM(deaths) as deaths'),db.raw('SUM(recovered) as recovered'))
    .groupBy('case_date')
    .orderBy('case_date', 'desc')
    .first()
}

//function for getting the timeseries records
//NOTE!!!!need to work on having the data dates updated and need to change the query accdg to my database
// function getGlobalData(db = connection) {
//     let today = new Date();
//     let dd = String(today.getDate()-2);// change the numbers
//     let mm = String(today.getMonth() + 1); 
//     let yyyy = today.getFullYear();

//     today = yyyy + '-' + mm + '-' + dd;
//     return db('timeseries')
//     .where('case_date',today)
//     .select('confirmed_cases', 'deaths', 'recovered')
//     .then((cases) => {
//         let confirmedCase = cases.map(c => c.confirmed_cases).reduce((a, b) => a + b);
//         let deaths = cases.map(c => c.deaths).reduce((a, b) => a + b);
//         let recovered = cases.map(c => c.recovered).reduce((a, b) => a + b);
//         return {confirmedCase, deaths, recovered}
//     })
// }

//function for the dropdown select country
function selectCountryDrop(db = connection) {
    return db('country')
    .select('id', 'country', 'flag')
}

//function to know the details on the selected country
function selectCountryData(id, db = connection) {
    return db ('timeseries')
    .where('country_id', id)
    .join('country', 'timeseries.country_id', 'country.id')
    .select('country', 
            'flag', 
            'case_date as caseDate', 
            'confirmed_cases as confirmedCases',
            'deaths',
            'recovered'
            )
    .groupBy('case_date')
    .orderBy('case_date', 'desc')
}




// var latest = getGlobalData().then((c) =>{
//    console.log(c) 
// })

// saveLatestData(getTimeseriesFromJSON())
