const express = require('express')

const db = require('../dbFile')

const router = express.Router()

module.exports = router

//routes for getGlobalData
router.get('/', (req, res) => {
  const template = 'homeGlobal'
  db.getGlobalData()
  .then((global) => {
    const viewData = {
      confirmedCases: global.confirmedCase,
      deaths: global.deaths,
      recovered: global.recovered
    }
    res.render(template, viewData)
  })
  .catch(err => {
    res.status(500).send('DATABASE ERROR: ' + err.message)
  })
})
