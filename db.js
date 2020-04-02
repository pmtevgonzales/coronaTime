    
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

module.exports = {
    getUsers: getUsers
}

//Code below are samples: YOU STILL NEED to edit this one.
function getUsers (db = connection) {
    return db('users')
        .select()
}