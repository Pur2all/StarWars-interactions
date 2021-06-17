import Character from '../models/character.js';

const OK_STATUS = 200;


const filmsCharacterAppeared = (req, res) => {
  Character.filmsInWhichCharacterAppeared(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({films: result});
      });
};

const charactersInteractionInFilm = (req, res) => {
  const charactersList = req.params.characters.split(',');

  Character.characterInteractionsInFilm(charactersList, req.params.filmTitle)
      .then((result) => {
        res.status(OK_STATUS)
            .send({interactions: result});
      });
};

const filmInWhichTwoCharacterSpeak = (req, res) => {
  Character.timesTwoCharactersAppearToghether(req.params.characterName1, req.params.characterName2)
      .then((result) => {
        res.status(OK_STATUS)
            .send({films: result});
      });
};

const areAppearedToghether = (req, res) => {
  Character.charactersAreAppearedToghether(req.params.characterName1, req.params.characterName2)
      .then((result) => {
        res.status(OK_STATUS)
            .send({isAppeared: result});
      });
};

export default {
  filmsCharacterAppeared,
  charactersInteractionInFilm,
  filmInWhichTwoCharacterSpeak,
  areAppearedToghether,
};
