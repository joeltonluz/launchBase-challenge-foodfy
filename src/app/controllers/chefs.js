const Chef = require('../models/Chef');

exports.index = (req, res) => {
  Chef.all((chefs) => {
    return res.render('admin/chefs/index', { chefs });
  });
};

exports.create = (req, res) => {
  return res.render('admin/chefs/create');
};

exports.post = (req, res) => {
  Chef.create(req.body, (chefs) => {
    return res.redirect('/admin/chefs');
  });
};

exports.show = (req, res) => {
  const { id } = req.params;
  Chef.findById(id, (chef) => {
    if (chef.total_recipes>0) {
      Chef.selectRecipes(id, (recipes) => {
        return res.render('admin/chefs/show', { chef, recipes });
      });
    } else {
      return res.render('admin/chefs/show', { chef });
    };
  });
};

exports.edit = (req, res) => {
  Chef.findById(req.params.id, (chef) => {
    return res.render('admin/chefs/edit', { chef });
  });
};

exports.put = (req, res) => {
  const { id } = req.body;
  Chef.update(req.body, (chef) => {
    return res.redirect(`/admin/chefs/${id}`)
  });
};

exports.delete = (req, res) => {
  const { id } = req.body;
  Chef.selectRecipes(id, (recipes) => {
    if (recipes.length > 0) {
      return res.send('Existem Receitas Vinculadas a Esse Chef!!!');
    } else {
      Chef.delete(id, (chef) => {
        return res.redirect('/admin/chefs');
      });
    };
  });
  /*Verificar se existe receita no nome do vagabundo*/

};