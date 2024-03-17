module.exports = (app)=>{
    const login_controller=require('../controller/login_controller');  
// app.get("/getVideos",login_controller.login);
    app.post('/login', login_controller.login)
}
