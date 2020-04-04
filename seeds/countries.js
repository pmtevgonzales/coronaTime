const countrySeed = require('../dbFile')

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('country').del()
    .then(function () {
      countrySeed.getCountries().then((c) => {
          var countries = Object.keys(c)
          countries.forEach((country) => {
            return knex('country').insert({
              country: country,
              flag: c[country].flag,
              code: c[country].code
            })
          })
      })
      // Inserts seed entries
      // return knex('country').insert([{

      // }]);
    });
};
