const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

exports.index = (req, res) =>{
  Recipe.allTopSix((recipes) => {
    return res.render('main/index', { recipes });
  });
};

exports.about = (req, res) => {
  return res.render('main/about');
};

exports.recipes = (req, res) => {
  const { filter } = req.query;
  
  if (filter) {
    Recipe.filterBy(filter, (recipes) => {
      return res.render('main/recipes', { filter, recipes })
    });
  } else {
    Recipe.all((recipes) => {
      return res.render('main/recipes', { recipes });
    });
  }
};

exports.chefs = (req, res) => {
  Chef.all((chefs) => {
    return res.render('main/chefs', { chefs });
  });
};

exports.recipeById = (req, res) => {
  Recipe.findById(req.params.index, (recipe) => {    
    if (!recipe) {
      return res.status(404).render('not-found');
    };

    return res.render('main/recipe', { recipe });  
  });
};