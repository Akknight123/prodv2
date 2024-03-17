module.exports = (app)=>{
    const dashboard_controller=require('../controller/dashboard_controller');  
    app.get("/getDashboard", dashboard_controller.getDashboard);

}
