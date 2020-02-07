const express = require('express');
const nunjucks = require('nunjucks');

const dataRecipes = require('./data');

const server = express();

server.use(express.static('public'));
server.set('view engine','njk');

nunjucks.configure("views", {
  express: server,
  autoescape: false,
  noCache: true,
});

server.get('/',(req, res) => {
  res.render('index', { recipes: dataRecipes });
});

server.get('/about', (req, res) => {
  res.render('about');
});

server.get('/recipes', (req, res) => {
  res.render('recipes', { recipes: dataRecipes });
});

server.get('/recipes/:index', (req, res) => {
  const { index } = req.params;
  const recipe = dataRecipes[index-1];
 
  if (!recipe) {
    return res.status(404).render('not-found');
  };
  return res.render('recipe', { recipe });
});

server.use((req, res, next) => {
  res.status(404).render('not-found');
});

server.listen(5000, () => {
  console.log('Server is running on port: 5000')
});