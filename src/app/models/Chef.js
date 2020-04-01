const db = require('../../config/db');
const { getDateHtml } = require('../../lib/utils');

module.exports = {
  all(callback) {
    const query = `
      SELECT chefs.*, (
        SELECT count(*)
        FROM recipes
        WHERE chefs.id = recipes.chef_id) as qtd_recipes
      FROM chefs
      ORDER BY id`;

    db.query(query,(err, results) =>  {
      if (err) { throw 'Database Error!!!' };

      callback(results.rows);
    });
  },
  create(data, callback) {
    const query = `
      INSERT INTO chefs
        (name, avatar_url, created_at) 
      VALUES
        ($1, $2, $3)
      RETURNING id`;

    const values = [
      data.name,
      data.avatar_url,
      getDateHtml(Date.now()).iso,
    ];

    db.query(query,values,(err, results) => {
      if (err) { throw 'Database Error !!!'}

      callback(results.rows[0].id);
    })

  },
  findById(id, callback) {
    const query = `
      SELECT chefs.*, (
        SELECT count(*)
        FROM recipes
        WHERE recipes.chef_id = chefs.id) as total_recipes
      FROM chefs
      WHERE id = $1
      ORDER BY id`;

    db.query(query,[id],(err, results) => {
      if (err) { throw 'Database Error!!!'}

      callback(results.rows[0]);
    })

  },
  update(data, callback) {
    const query = `
      UPDATE chefs SET 
        name = ($1),
        avatar_url = ($2)
      WHERE
        id = ($3)`;
    
    const values = [
      data.name,
      data.avatar_url,
      data.id
    ];

    db.query(query, values, (err, results) => {
      if (err) { throw 'Database Error !!!'}

      callback();
    });
  },
  delete(id, callback) {
    db.query('DELETE FROM chefs WHERE id = $1', [id], (err, results) => {
      if (err) { throw 'Database Errror!' }

      callback();
    });
  },
  selectRecipes(id, callback) {
    const query = `
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs ON chefs.id = recipes.chef_id
      WHERE chef_id = $1
    `;

    db.query(query, [id], (err, results) => {
      if (err) { throw 'Database Error!!!' }

      callback(results.rows);
    });
  },
};