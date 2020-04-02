    
const environment = process.env.NODE_ENV || 'development'
const config = require('./knexfile')[environment]
const connection = require('knex')(config)

const fetch = require('node-fetch')

module.exports = {
    read: read,
    getUsers: getUsers
}

function read() {
    //this url is the data from Johns Hopkins CSSE regarding COVID-19 that transforms into a json file updated daily.
    let url = "https://pomber.github.io/covid19/timeseries.json"
    let settings = { method: "Get" }

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            console.log(json)
        })
}

read()



//Code below are samples: YOU STILL NEED to edit this one.
function getUsers (db = connection) {
    return db('users')
        .select()
}

