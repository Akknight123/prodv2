module.exports = (app) => {
    const user_controller = require('../controller/user_controller');
    const watch_controller = require('../controller/watch_later_controller');

    app.get('/getUsers', user_controller.findAll);
    app.get('/getUserByUid', user_controller.getSingleUser);
    app.post('/updateUser', user_controller.addName);
    app.post('/updateProfile', user_controller.update);
    app.post('/userLogin', user_controller.create);
    app.get('/watchLaterVideos', watch_controller.getAllVideos);
    app.get('/watchLaterData', watch_controller.getWatchlaterData);
    app.get('/watchLaterRawData', watch_controller.getWatchLaterRawData);
    app.get('/watchLaterplaylist', watch_controller.getAllPlaylist);
    app.post('/addWatchVideo', watch_controller.addWatchLaterVideo);
    app.post('/addWatchPlaylist', watch_controller.addWatchLaterPlaylist);
    app.post('/removeWatchVideo', watch_controller.watchLaterVideoRemove);
    app.post('/removeWatchPlaylist', watch_controller.watchLaterPlaylistRemove);
    // app.get("/removeCat", user_controller.removeOne)
    // app.get("/categoryByID", user_controller.getOne)
}


