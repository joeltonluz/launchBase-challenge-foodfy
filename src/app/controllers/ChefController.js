const Chef = require('../models/Chef');
const File = require('../models/File');

const { getAdjustedPath } = require('../../lib/utils');

module.exports = {
  create (req, res) {
    return res.render('admin/chefs/create');
  },
  async index (req, res) {
    const results = await Chef.all();
    let chefs = results.rows;
    
    chefs.forEach(chef => {
      chef.path = getAdjustedPath(chef.path).modelBg;
    });

    return res.render('admin/chefs/index', { chefs });
  },
  async post(req, res) {
    const { filename, path } = req.file;
    const results = await File.create(filename, path);
    const fileId = results.rows[0].id;
    
    await Chef.create(req.body, fileId);

    return res.redirect('/admin/chefs');
  },
  async show(req, res) {
    let results = await Chef.findById(req.params.id);
    let chef = results.rows[0];

    chef.path = getAdjustedPath(chef.path).modelBg;

    results = await Chef.selectRecipes(req.params.id);
    let recipes = results.rows;

    return res.render('admin/chefs/show', { chef, recipes });
  },
  async edit(req, res) {
    const results = await Chef.findById(req.params.id);
    let chef = results.rows[0];

    chef.path = getAdjustedPath(chef.path,`${req.headers.host}`).modelImg;

    return res.render('admin/chefs/edit', { chef });
  },
  async put(req, res) {
    const { id, file_id } = req.body;
    const { filename, path } = req.file;
    
    //Incluir novo Avatar no Banco de Dados
    const results = await File.create(filename, path);
    let newFileId = results.rows[0].id;

    //Atualizar as informações do Chef, com o ID novo
    await Chef.update(req.body, newFileId);
    
    //Excluir o avatar antigo do DB e LOCAL.
    if (file_id) {
      await File.delete(file_id);
    };

    return res.redirect(`/admin/chefs/${id}`)
  }, 
  async delete(req, res) {
    const { id, file_id } = req.body;

    let results = await Chef.selectRecipes(id);
    let recipes = results.rows;

    if (recipes.length > 0) {
      return res.send('Existem Receitas Vinculadas a Esse Chef!!!');
    } else {

      await Chef.delete(id);
      await File.delete(file_id);

      return res.redirect('/admin/chefs');       
    };
  },
};