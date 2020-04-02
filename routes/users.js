
const express = require('express')

const db = require('../db')

const router = express.Router()
//Code below are samples: YOU still need to edit this one.
router.get('/', (req, res) => {
    db.getUsers()
      .then(users => {
        res.render('index', {users: users})
      })
      .catch(err => {
        res.status(500).send('DATABASE ERROR: ' + err.message)
      })
  })