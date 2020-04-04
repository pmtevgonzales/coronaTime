
exports.up = (knex, Promise) => {
  return knex.schema.createTable('timeseries', (table) => {
      table.increments('id').primary()
      table.integer('country_id')
      table.date('case_date')
      table.integer('confirmed_cases')
      table.integer('deaths')
      table.integer('recovered')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('timeseries')
};
