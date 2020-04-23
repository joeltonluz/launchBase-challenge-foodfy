const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const MainController = require('./app/controllers/MainController');
const RecipeController = require('./app/controllers/RecipeController');
const ChefController = require('./app/controllers/ChefController');

routes.get('/', MainController.index);
routes.get('/about', MainController.about);
routes.get('/recipes', MainController.recipes);
routes.get('/chefs', MainController.chefs);
routes.get('/recipes/:index', MainController.recipeById);

routes.get('/admin', (req, res) => {
  return res.redirect('admin/recipes');
});
routes.get('/admin/recipes', RecipeController.index);
routes.get('/admin/recipes/create', RecipeController.create);
routes.get('/admin/recipes/:id', RecipeController.show);
routes.get('/admin/recipes/:id/edit', RecipeController.edit);
routes.post('/admin/recipes', multer.array('photos', 5), RecipeController.post);
routes.put('/admin/recipes', multer.array('photos', 5), RecipeController.put);
routes.delete('/admin/recipes', RecipeController.delete);

routes.get('/admin/chefs',ChefController.index);
routes.get('/admin/chefs/create', ChefController.create);
routes.get('/admin/chefs/:id', ChefController.show);
routes.get('/admin/chefs/:id/edit', ChefController.edit);
routes.post('/admin/chefs',multer.single('avatar_url'), ChefController.post);
routes.put('/admin/chefs', multer.single('avatar_url'), ChefController.put);
routes.delete('/admin/chefs', ChefController.delete);

routes.use((req, res, next) => {
  res.status(404).render('not-found');
});

module.exports = routes;