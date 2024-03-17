module.exports = (app) => {
  const video_controller = require('../controller/video_controller');
  app.get("/getVideos", video_controller.findAll);
  app.get("/subCatVideos", video_controller.findAllBySubCat);
  app.post('/createVideo', video_controller.create);
  app.get("/removeVideo", video_controller.removeOne)
}


/* 
{
  "url":"url",
  "category":"category",
  "playList":"playList",
  "playlistId":"playlistId"
}
 */