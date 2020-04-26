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
    //data coming from US Standard Time results to 1-2 days delay
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
    let inserts = []
    casesByCountry.then((c) => {
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
                            inserts.push(db('timeseries').insert({
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
                            )
                        })
                    }
                })
            }) 
        })
    })
    return Promise.all(inserts)
    .then()
    .catch((err) => {
        console.error(err)
    })
}


function initialiseCountry(db = connection) {
    let inserts = []
    getCountriesFromJSON().then((c) => {
        var countries = Object.keys(c)
        db('country')
            .select('country')
            .then((cInDB)=>{
                countries.forEach((country) => {
                    if (cInDB.find(countryInDb => countryInDb.country === country) == null){
                        inserts.push(db('country').insert({
                            country: country,
                            flag: c[country].flag,
                            code: c[country].code
                        })
                        .then((id) => {
                            console.log('id ' + id + ' with ' + country)
                        })
                        .catch ((err) => {
                            console.error(err)
                        })
                        )
                    }   
                })
            })
    })
    
    return Promise.all(inserts)
    .then(() => {
        return db('country').select()
    })
    .catch((err) => {
        console.error(err)
    })
}



//function for getting the timeseries records
function getGlobalData(db = connection) {
    return db('timeseries')
    .select('case_date as caseDate',db.raw('SUM(confirmed_cases) as confirmedCases'),db.raw('SUM(deaths) as deaths'),db.raw('SUM(recovered) as recovered'))
    .groupBy('case_date')
    .then ((cases) => {
        return cases.sort((a, b) => {
            return new Date(b.caseDate) - new Date(a.caseDate)
        })
    })
    .then((cases) => {
        return cases[0]
    })
}

//function for the dropdown select country
function selectCountryDrop(db = connection) {
    return db('country')
    .select('id', 'country', 'flag')
    .orderBy('country')
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
    .then ((cases) => {
        return cases.sort((a, b) => {
            return new Date(b.caseDate) - new Date(a.caseDate)
        })
    })
}

