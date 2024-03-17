module.exports = (app) => {
    const subcategory_controller = require('../controller/subcategory_controller');

    app.get('/getSubCategories', subcategory_controller.findAll);
    app.get('/getSubCatById', subcategory_controller.getSubsById);
    app.post('/createsubcategory', subcategory_controller.create);
    app.get("/removesubCat", subcategory_controller.removeOne)
    app.get("/subcategoryByID", subcategory_controller.getOne)
}


