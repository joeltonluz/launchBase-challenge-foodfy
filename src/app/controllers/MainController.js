const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

const { getAdjustedPath } = require('../../lib/utils');

module.exports = {
  about(req, res) {
    return res.render('main/about');
  },
  async index(req, res) {
    const results = await Recipe.allTopSix();

    return res.render('main/index', { recipes: results.rows });
  },
  async recipes(req, res) {
    const { filter } = req.query;
    let results;
    
    if (filter) {
      results = await Recipe.filterBy(filter);
      return res.render('main/recipes', { filter, recipes: results.rows });
    } else {
      results = await Recipe.all();
      return res.render('main/recipes', { recipes: results.rows });
    }
  }, 
  async chefs(req, res) {
    const results = await Chef.all();
    let chefs = results.rows;

    chefs.forEach(chef => {
      chef.path = getAdjustedPath(chef.path).modelBg;
    });

    return res.render('main/chefs', { chefs });
  },
  async recipeById (req, res) {
    const results = await Recipe.findById(req.params.index);
    let recipe = results.rows[0];

    if (!recipe) {
      return res.status(404).render('not-found');
    };
  
    return res.render('main/recipe', { recipe });  
  },
};