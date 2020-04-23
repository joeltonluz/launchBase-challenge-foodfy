const db = require('../../config/db');
const { getDateHtml } = require('../../lib/utils');

module.exports = {
  all() {
    return db.query(`
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs on chefs.id = recipes.chef_id 
    `);
  },
  allTopSix() {
    const query = `
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs on chefs.id = recipes.chef_id 
      LIMIT 6
    `;

    return db.query(query);
  },
  create(data) {
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
    
    return db.query(query,values);
  },
  findById(id) {
    return db.query(`
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs ON chefs.id = recipes.chef_id
      WHERE recipes.id = $1`,[id]);
  },
  filterBy(filter) {
    const query = `
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs on chefs.id = recipes.chef_id
      WHERE recipes.title ILIKE '%${filter}%'`;

    return db.query(query);
  },
  update(data) {
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
    
    return db.query(query, values);
  },
  delete(id) {
    return db.query('DELETE FROM recipes WHERE id = $1', [id]);
  },
  selectChefs() {
    return db.query('SELECT id, name FROM chefs ORDER BY id');
  },
  files(id) {
    return db.query(`
      SELECT  recipe_files.id, recipe_files.recipe_id, recipe_files.file_id, files.name, files.path
      FROM recipe_files
      INNER JOIN files on files.id = recipe_files.file_id
      WHERE recipe_id = $1`,[id]);
  }
}