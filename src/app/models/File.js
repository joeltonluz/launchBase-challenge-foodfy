const db = require('../../config/db');
const fs = require('fs');

module.exports = {
  create(fileName, path) {
    const query = `
      INSERT INTO files 
        (name, path)
      VALUES 
        ($1, $2)
      RETURNING id`;

    const values = [
      fileName,
      path
    ];
    
    return db.query(query,values);
  },
  async createArray({filename, path, recipe_id}) {
    try {
      
      const results = await this.create(filename, path);
      const fileId = results.rows[0].id;

      const query = `
        INSERT INTO recipe_files
          (recipe_id, file_id)
        VALUES
          ($1, $2)`;
      
      return db.query(query,[recipe_id,fileId]);

    } catch(err) {
      console.log(err);
    };
  },
  update(filename, path, fileId) {
    const query = `
      UPDATE files SET
        name = $1, 
        path = $2
      WHERE
        id = $3`;
    
    const values = [
      filename,
      path,
      fileId
    ];

    return db.query(query, values);
  },
  async delete(fileId, delRecipeFile) {
    try {
      const results = await db.query(`
        SELECT path
        FROM files
        WHERE id = $1`,[fileId]);

      const file = results.rows[0];

      fs.unlinkSync(file.path);

      if (delRecipeFile) {
        await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [fileId]);
      }

      return db.query(`DELETE FROM files WHERE id = $1`, [fileId]);
    } catch(err) {
      console.log(err);
    };
  },
}