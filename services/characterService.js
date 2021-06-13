import characterControl from '../controllers/characterController.js';

export default (app) => {
  app.get('/character/:characterName', characterControl.films);
  
  app.get('/character/:characters/:filmTitle', function(req, res) {
      res.send('hello world');
    });

  app.get('/character/speak/:characterNames', function(req, res) {
      res.send('hello world');
  });
}
