const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    const results = await Recipe.all();
    return res.render('admin/recipes/index', {recipes: results.rows});
  },  
  async create(req, res) {
    const results = await Recipe.selectChefs();
    return res.render('admin/recipes/create', { chefs: results.rows });
  },  
  async post(req, res) {
    const keys = Object.keys(req.body)
    
    for(key of keys) {
      //req.body.CAMPO
      if (!req.body[key]) {
        return res.send('Please, fill all fields');
      };
    };

    if (req.files.length==0) 
      return res.send('Por Favor, envie pelo menos uma imagem!!');
  
    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(file => File.createArray({...file, recipe_id: recipeId}));
    await Promise.all(filesPromise);

    return res.redirect('/admin/recipes');
  },
  async show(req, res) {
    let results = await Recipe.findById(req.params.id);
    const recipe = results.rows[0];
    
    if (!recipe) {
      return res.status(404).render('not-found');
    };

    results = await Recipe.files(recipe.id);
    const files = results.rows.map(file => ({
      ...file,
      src: `//${req.headers.host}${file.path.replace('public','')}`,
      //src: `${req.procotol}://${req.headers.host}${file.path.replace('public','')}`,
    }));

    return res.render('admin/recipes/show', { recipe, files });  
  },
  async edit(req, res) {
    let results = await Recipe.findById(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send('Receita NÃO encontrada');
  
    results = await Recipe.selectChefs();
    const chefs = results.rows;

    results = await Recipe.files(recipe.id);
    let files = results.rows;
    files = files.map(file => ({
      ...file,
      src: `//${req.headers.host}${file.path.replace('public','')}`,
    }));

    return res.render('admin/recipes/edit', { recipe, chefs, files });
  },  
  async put(req, res) {
    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file =>
        File.createArray({...file, recipe_id: req.body.id}));

      await Promise.all(newFilesPromise);
    };

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(',');
      const lastIndex = removedFiles.length -1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map(id => File.delete(id, true));
      await Promise.all(removedFilesPromise);
    };

    await Recipe.update(req.body);
    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id);

    return res.redirect('/admin/recipes');
  },
}