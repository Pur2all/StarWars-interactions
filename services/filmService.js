import FilmControl from '../controllers/filmController.js';

export default (app) => {
  /*
      Input: nome di un personaggio
      Output: renderizza la pagina del personaggio con le info
  */
  app.get('/film/:filmTitle', FilmControl.find);

  app.get('/films', FilmControl.findAll);

  app.get('/film/appeared/firstTimeStory/:characterName', FilmControl.firstAppearanceOfCharacterOrderByHistory);

  app.get('/film/appeared/firstTimeFilmPub/:characterName', FilmControl.firstAppearanceOfCharacterOrderByPub);

  app.get('/film/mentioned/firstTimeStory/:characterName', FilmControl.firstMentionOfCharacterOrderByHistory);

  app.get('/film/mentioned/firstTimeFilmPub/:characterName', FilmControl.firstMentionOfCharacterOrderByPub);

  /*
      Input: lista di film
      Output: personaggi che sono menzionati nei film specificati
  */
  app.get('/film/mentioned/:filmTitles', FilmControl.charactersMentionedInFilms);

  /*
    Input: lista di film
    Output: personaggi che appaiono nei film specificati
  */
  app.get('/film/appeared/:filmTitles', FilmControl.charactersAppearedInFilms);

  app.get('/film/search/:filmTitle', FilmControl.search);
};
