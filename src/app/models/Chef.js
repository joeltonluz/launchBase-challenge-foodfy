const db = require('../../config/db');
const { getDateHtml } = require('../../lib/utils');

module.exports = {
  all() {
    const query = `
      SELECT chefs.*, files.path, (
        SELECT count(*)
        FROM recipes
        WHERE chefs.id = recipes.chef_id) as qtd_recipes
      FROM chefs
      LEFT JOIN files on files.id = chefs.file_id
      ORDER BY chefs.id`;

    return db.query(query);
  },
  create(data, fileId) {
    const query = `
      INSERT INTO chefs
        (name, avatar_url, created_at, file_id) 
      VALUES
        ($1, $2, $3, $4)
      RETURNING id`;

    const values = [
      data.name,
      data.avatar_url,
      getDateHtml(Date.now()).iso,
      fileId
    ];

    return db.query(query,values);
  },
  findById(id) {
    const query = `
      SELECT chefs.*, files.name as filename, files.path, (
        SELECT count(*)
        FROM recipes
        WHERE recipes.chef_id = chefs.id) as total_recipes
      FROM chefs
      LEFT JOIN files on files.id = chefs.file_id
      WHERE chefs.id = $1
      ORDER BY id`;

    return db.query(query,[id]);
  },
  update(data, fileId) {
    const query = `
      UPDATE chefs SET 
        name = ($1),
        avatar_url = ($2),
        file_id = ($3)
      WHERE
        id = ($4)`;
    
    const values = [
      data.name,
      data.avatar_url,
      fileId,
      data.id
    ];

    return db.query(query, values);
  },
  delete(id) {
    return db.query('DELETE FROM chefs WHERE id = $1', [id]);
  },
  selectRecipes(id) {
    const query = `
      SELECT recipes.*, chefs.name as chef
      FROM recipes
      INNER JOIN chefs ON chefs.id = recipes.chef_id
      WHERE chef_id = $1
    `;
    
    return db.query(query, [id]);
  },
};