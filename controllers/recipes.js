const dataRecipes = require('../data.json');
const fs = require('fs');

exports.index = (req, res) => {
  return res.render('admin/recipes/index', {recipes : dataRecipes.recipes});
};

exports.create = (req, res) => {
  return res.render('admin/recipes/create');
};

exports.show = (req, res) => {
  const { id } = req.params;

  const foundRecipe = dataRecipes.recipes.find((recipe) => {
    return id == recipe.id;
  });

  if (!foundRecipe) {
    return res.send('rapaz, achou não');
  };

  return res.render('admin/recipes/show', { recipe: foundRecipe });
};

exports.edit = (req,res) => {
  const { id } = req.params;

  const foundRecipe = dataRecipes.recipes.find((recipe) => {
    return id == recipe.id;
  });

  if (!foundRecipe) {
    res.send('não achei mano');
  };
  return res.render('admin/recipes/edit', { recipe: foundRecipe });
};

exports.post = (req,res) => {
  const { image, imageLocal, title, author, ingredients, preparation, information } = req.body;
  const id = Number(dataRecipes.recipes.length+1);

  dataRecipes.recipes.push({
    id,
    image,
    imageLocal,
    title,
    author,
    ingredients,
    preparation,
    information
  });

  fs.writeFile('./data.json',JSON.stringify(dataRecipes,null,2), (err) => {
    if (err) {
      return res.send('Houver um erro na hora de gravar !!');
    };
    return res.redirect('/admin/recipes');
  });
};

exports.put = (req,res) => {
  const { id, ingredients } = req.body;
  let index = 0;

  const foundRecipe = dataRecipes.recipes.find((recipe, indice) => {
    if (recipe.id == id) {
      index = indice;
      return true;
    };
  });

  if (!foundRecipe) {
    return res.send('Não consegui editar essa receita!!');
  };

  const recipe = {
    id: Number(req.body.id),
    ...foundRecipe,
    ...req.body,
  };

  dataRecipes.recipes[index] = recipe;

  fs.writeFile('./data.json',JSON.stringify(dataRecipes,null,2), (err) => {
    if (err) {
      return res.send(' Não consegui deletar, favor verificar !!');
    };
    
    return res.redirect(`/admin/recipes/${id}`);
  });
};

exports.delete = (req,res) => {
  const { id } = req.body;
  const filteredRecipes = dataRecipes.recipes.filter((r) => {
    return r.id != id;
  });

  dataRecipes.recipes = filteredRecipes;

  fs.writeFile('./data.json',JSON.stringify(dataRecipes,null,2), (err) => {
    if (err) {
      return res.send(' Não consegui deletar, favor verificar !!');
    };

    return res.redirect('/admin/recipes');
  });
};