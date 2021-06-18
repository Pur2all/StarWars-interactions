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
};
