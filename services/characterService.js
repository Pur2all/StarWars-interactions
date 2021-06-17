import characterControl from '../controllers/characterController.js';

export default (app) => {
  /* 
        Input: nome di un personaggio
        Output: lista dei film in cui il personaggio appare
  */
  app.get('/character/:characterName', characterControl.films);
  
   /*
        Input: lista nomi personaggio (list) e titolo di un film (f)
        Output: lista delle interazioni dei personaggi nella lista 'list' nel film 'f' 
    */
  app.get('/character/:characters/:filmTitle', function(req, res) {
      res.send('hello world');
    });
  
  /*
      Input: 2 nomi
      Output: film in cui i due personaggi compaiono insieme e numero di volte in cui accade
  */
  app.get('/character/speak/:characterName1/:characterName2', function(req, res) {
      res.send('hello world');
  });
}
