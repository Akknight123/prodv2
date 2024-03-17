module.exports = (app)=>{
    const category_controller=require('../controller/category_controller');

    app.get('/getCategories', category_controller.findAll);
    app.post('/createcategory', category_controller.create);
    app.get("/removeCat",category_controller.removeOne)
    app.get("/categoryByID",category_controller.getOne)
}


