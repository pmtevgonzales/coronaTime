const express = require('express')

const db = require('../dbFile')

const router = express.Router()
const utilities = require('../utilities')


module.exports = router

//routes for getGlobalData
router.get('/', (req, res) => {
  const template = 'homeGlobal'
  db.getGlobalData()
  .then((global) => {
    const viewData = {
      currentDate: utilities.dateToday(),
      confirmedCases: global.confirmedCase,
      deaths: global.deaths,
      recovered: global.recovered
    }
    db.selectCountryDrop().then(c =>{
      c.unshift({})
      viewData.countries = c
      res.render(template, viewData)
    })
  })
  .catch(err => {
    res.status(500).send('DATABASE ERROR: ' + err.message)
  })
})

