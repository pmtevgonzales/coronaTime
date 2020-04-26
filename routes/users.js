const express = require('express')

const db = require('../dbFile')

const router = express.Router()
const utilities = require('../utilities')


module.exports = router

//routes for mainPage
router.get('/', (req, res) => {
  const template = 'homeGlobal'
  //1st initializeCountry
  db.initialiseCountry()
  .then ((countries) => {
    db.saveLatestData(db.getTimeseriesFromJSON())
    .then(() => {
      db.getGlobalData()
      .then((globalData) => {
        countries.unshift({})
        countries.unshift({country:'SELECT COUNTRY'})
          const viewData = {
          currentDate: utilities.dateToday(),
          caseDate: utilities.formatDate(globalData.caseDate),
          confirmedCases: globalData.confirmedcases,
          deaths: globalData.deaths,
          recovered: globalData.recovered,
          countries: countries
        }
        res.render(template, viewData)
      })
      .catch(err => {
        res.status(500).send('DATABASE ERROR: ' + err.message)
      })
    })
  })
})


//router to link the on the selectedCountry page
router.get('/country/:id', (req, res) => {
  const id = Number(req.params.id)
  const template = 'selectedCountry'
  db.selectCountryData(id)
    .then((country) => {
      const countryDataToday = country[0]
      const countryDataYesterday = country[1]
      const viewData = {
        countryName: countryDataToday.country,
        countryFlag: countryDataToday.flag,
        currentDate: utilities.dateToday(),
        caseDate: utilities.formatDate(countryDataToday.casedate),
        cases: countryDataToday.confirmedcases,
        deaths: countryDataToday.deaths,
        recovered: countryDataToday.recovered,
        casesToday: countryDataToday.confirmedcases - countryDataYesterday.confirmedcases,
        deathsToday: countryDataToday.deaths - countryDataYesterday.deaths
      }
      res.render(template, viewData)
    })
})

// routes for refreshing the mainpage
router.post ('/latestUpdate', (req, res) => {
  return res.redirect ('/')
})

