const express = require('express')

const db = require('../dbFile')

const router = express.Router()
const utilities = require('../utilities')


module.exports = router

//routes for mainPage
router.get('/', (req, res) => {
  const template = 'homeGlobal'
  db.getGlobalData()
  .then((globalData) => {
      const viewData = {
      currentDate: utilities.dateToday(),
      caseDate: utilities.formatDate(globalData.caseDate),
      confirmedCases: globalData.confirmedCases,
      deaths: globalData.deaths,
      recovered: globalData.recovered
    }
    db.selectCountryDrop().then(c =>{
      c.unshift({})
      c.unshift({country:'SELECT COUNTRY'})
      viewData.countries = c
      res.render(template, viewData)
    })
  })
  .catch(err => {
    res.status(500).send('DATABASE ERROR: ' + err.message)
  })
})


//router to link the on the selectedCountry page
router.get('/country/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const template = 'selectedCountry'
  db.selectCountryData(id)
    .then((country) => {
      const countryDataToday = country[0]
      const countryDataYesterday = country[1]
      const viewData = {
        countryName: countryDataToday.country,
        countryFlag: countryDataToday.flag,
        currentDate: utilities.dateToday(),
        caseDate: utilities.formatDate(countryDataToday.caseDate),
        cases: countryDataToday.confirmedCases,
        deaths: countryDataToday.deaths,
        recovered: countryDataToday.recovered,
        casesToday: countryDataToday.confirmedCases - countryDataYesterday.confirmedCases,
        deathsToday: countryDataToday.deaths - countryDataYesterday.deaths
      }

      res.render(template, viewData)
    })

})

// routes for refreshing the mainpage
router.post ('/latestUpdate', (req, res) => {
  db.saveLatestData(db.getTimeseriesFromJSON())
  .then(() => {
    utilities.sleep(1000)
    .then(()=>{
      return res.redirect ('/')
    })
  })
})