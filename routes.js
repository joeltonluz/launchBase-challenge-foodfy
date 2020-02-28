const express = require('express');
const routes = express.Router();
const dataRecipes = require('./data.json');
const recipes = require('./controllers/recipes');

routes.get('/',(req, res) => {
  res.render('index', { recipes: dataRecipes.recipes });
});
routes.get('/about', (req, res) => {
  res.render('about');
});
routes.get('/recipes', (req, res) => {
  res.render('recipes', { recipes: dataRecipes.recipes });
});
routes.get('/recipes/:index', (req, res) => {
  const { index } = req.params;
  const recipe = dataRecipes.recipes[index-1];
 
  if (!recipe) {
    return res.status(404).render('not-found');
  };
  return res.render('recipe', { recipe });
});

routes.get('/admin', (req, res) => {
  return res.render('admin/index');
});

routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);
routes.post('/admin/recipes', recipes.post);
routes.put('/admin/recipes', recipes.put);
routes.delete('/admin/recipes', recipes.delete);

routes.use((req, res, next) => {
  res.status(404).render('not-found');
});

module.exports = routes;