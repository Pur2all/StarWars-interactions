import CharacterControl from '../controllers/characterController.js';


export default (app) => {
  /*
      Input: nome di un personaggio
      Output: renderizza la pagina del personaggio con le info
  */
  app.get('/character/:characterName', CharacterControl.find);

  /*
      Input: nome di un personaggio
      Output: lista dei film in cui il personaggio appare
  */
  app.get('/character/films/:characterName', CharacterControl.filmsCharacterAppeared);

  /*
      Input: lista nomi personaggi (list) e titolo di un film (f)
      Output: lista delle interazioni dei personaggi nella lista 'list' nel film 'f'
  */
  app.get('/character/interactions/:characters/:filmTitle', CharacterControl.charactersInteractionInFilm);

  /*
      Input: 2 nomi
      Output: film in cui i due personaggi compaiono insieme e numero di volte in cui accade
  */
  app.get('/character/speak/:characterName1/:characterName2', CharacterControl.filmInWhichTwoCharacterSpeak);

  /*
      Input: 2 nomi
      Output: true se i due personaggi hanno parlato insieme, false altrimenti
  */
  app.get('/character/interacted/:characterName1/:characterName2', CharacterControl.areAppearedToghether);

  /*
      Input: nome di un personaggio
      Output: lista di personaggi che non conosce
  */
  app.get('/character/notknows/:characterName', CharacterControl.charactersNotKnown);

  /*
      Input: nome di due personaggi
      Output: lista di personaggi che conoscono entrambi
  */
  app.get('/character/commonKnown/:firstCharacterName/:secondCharacterName', CharacterControl.commonKnownCharacters);

  /*
      Input: nome di due personaggi
      Output: il percorso minore per arrivare da uno all'altro
  */
  app.get('/character/shortestPath/:fromName/:toName', CharacterControl.shortestPath);

  /*
      Output: Tutti i personaggi
  */
  app.get('/characters', CharacterControl.findAll);

  app.get('/characters/search/:characterName', CharacterControl.search);
};
