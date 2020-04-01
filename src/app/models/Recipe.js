const db = require('../../config/db');
const { getDateHtml } = require('../../lib/utils');

module.exports = {
  all(callback) {
    db.query(`
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs on chefs.id = recipes.chef_id 
      `,(err, results) => {
        if (err) {
          throw 'DataBase Error!!!'
        };

        callback(results.rows);
      });
  },
  allTopSix(callback) {
    const query = `
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs on chefs.id = recipes.chef_id 
      LIMIT 6
    `;

    db.query(query,(err,results) => {
      if (err) { throw 'Database Error!' };

      callback(results.rows);
    })
  },
  create(data, callback) {
    const query = `
      INSERT INTO recipes
        (chef_id, image, title, ingredients, preparation, information, created_at)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id`;

    const values = [
      data.chef_id,
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      getDateHtml(Date.now()).iso,
    ];
    
    db.query(query,values, (err, results) => {
      if (err) { throw 'Database Error !!!'}

      callback();
    })

  },
  findById(id, callback) {
    db.query(`
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs ON chefs.id = recipes.chef_id
      WHERE recipes.id = $1`,[id], (err,results) => {
        if (err) { throw 'Database Error!!!'}

        callback(results.rows[0]);
      });
  },
  filterBy(filter, callback) {
    const query = `
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs on chefs.id = recipes.chef_id
      WHERE recipes.title ILIKE '%${filter}%'`;

    db.query(query,(err, results) => {
        if (err) {
          throw 'DataBase Error!!!'
        };

      callback(results.rows);
    });
  },
  update(data, callback) {
    const query = `
      UPDATE recipes SET 
        chef_id = ($1),
        image = ($2),
        title = ($3),
        ingredients = ($4),
        preparation = ($5),
        information = ($6)
      WHERE
        id = ($7)`;

    const values = [
      data.chef_id,
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];
    
    db.query(query, values, (err, results) => {
      if (err) { throw 'Database Error!!!'}

      callback();
    });
  },
  delete(id, callback) {
    db.query('DELETE FROM recipes WHERE id = $1', [id], (err, results) => {
      if (err) { throw 'Database Error!!!'}

      callback();
    });
  },
  selectChefs(callback) {
    db.query('SELECT id, name FROM chefs ORDER BY id',(err, results) => {
      if (err) { throw 'Database Error!!!'}

      callback(results.rows);
    });

  }
}