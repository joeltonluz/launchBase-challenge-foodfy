const Recipe = require('../models/Recipe');

exports.index = (req, res) => {
  Recipe.all((recipes) => {
    return res.render('admin/recipes/index', {recipes});
  });
};

exports.create = (req, res) => {
  Recipe.selectChefs((chefs) => {
    return res.render('admin/recipes/create', { chefs });
  })
};

exports.post = (req, res) => {
  const keys = Object.keys(req.body)
  
  for(key of keys) {
    //req.body.CAMPO
    if (!req.body[key]) {
      return res.send('Please, fill all fields');
    };
  };

  Recipe.create(req.body,(recipes) => {
    return res.redirect('/admin/recipes');
  });
};

exports.show = (req, res) => {
  Recipe.findById(req.params.id, (recipe) => {    
    if (!recipe) {
      return res.status(404).render('not-found');
    };

    return res.render('admin/recipes/show', { recipe });  
  });
};

exports.edit = (req, res) => {
  Recipe.findById(req.params.id, (recipe) => {
    if (!recipe) {
      return res.send('Recieta NÃO encontrada');
    };

    Recipe.selectChefs((chefs) => {
      return res.render('admin/recipes/edit', { recipe, chefs });
    });
  });
};

exports.put = (req, res) => {
  const { id } =  req.body;
  Recipe.update(req.body, (recipe) => {
    return res.redirect(`/admin/recipes/${id}`);
  });
};

exports.delete = (req, res) => {
  Recipe.delete(req.body.id,(recipe) => {

    return res.redirect('/admin/recipes');
  });
};