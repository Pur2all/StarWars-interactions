import FilmControl from '../controllers/filmController.js';

export default (app) => {
  app.get('/film/appeared/firstTimeStory/:characterName', function(req, res) {
    res.send('hello world');
  });

  app.get('/film/appeared/firstTimeFilmPub/:characterName', function(req, res) {
    res.send('hello world');
  });

  app.get('/film/mentioned/firstTimeStory/:characterName', function(req, res) {
    res.send('hello world');
  });

  app.get('/film/mentioned/firstTimeFilmPub/:characterName', function(req, res) {
    res.send('hello world');
  });

  app.get('/character/speak/together/:characterNames', function(req, res) {
    res.send('hello world');
  });

  app.get('/film/:filmTitle', function(req, res) {
    res.send('hello world');
  });

  /*
    Input: lista di film
    Output: personaggi che sono menzionati nei film specificati
  */
  app.get('/film/mentioned/:filmTitles', function(req, res) {
    res.send('hello world');
  });

  /*
    Input: lista di film
    Output: personaggi che appaiono nei film specificati
  */
  app.get('/film/appeared/:filmTitles', function(req, res) {
    res.send('hello world');
  });
};
