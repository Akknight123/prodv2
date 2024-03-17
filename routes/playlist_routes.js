module.exports = (app) => {
    const category_controller = require('../controller/playList_controller');

    app.get('/getPlaylist', category_controller.findAll);
    app.get('/getPlaylistByid', category_controller.findOne);
    app.get('/getPlaylistBySubCatid', category_controller.findAllBySubCat);

    app.post('/createPlaylist', category_controller.create);
    app.get("/removePlaylist", category_controller.removeOne)
    app.get("/updateVideo", category_controller.addCategory)
    app.post("/addVideos", category_controller.getMultipleQueries)
    app.post("/removeVideofromPlaylist", category_controller.removeVideoFromPlayList)


}


