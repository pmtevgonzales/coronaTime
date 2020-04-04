
exports.up = (knex, Promise) => {
  return knex.schema.createTable('country', (table) => {
    table.increments('id').primary()
    table.string('country')
    table.string('flag')
    table.string('code')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('country')
};
