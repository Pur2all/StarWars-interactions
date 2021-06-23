import Character from '../models/character.js';

const OK_STATUS = 200;


const find = (req, res) => {
  Character.find(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .render('./pages/character', {character: result});
      });
};

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

const charactersNotKnown = (req, res) => {
  Character.charactersNotKnown(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({characters: result});
      });
};

const commonKnownCharacters = (req, res) => {
  Character.commonKnownCharacters(req.params.firstCharacterName, req.params.secondCharacterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({characters: result});
      });
};

const shortestPath = (req, res) => {
  Character.shortestPath(req.params.fromName, req.params.toName)
      .then((result) => {
        const path = [];

        if (result.length > 0) {
          path.push(result[0].start.properties.name);
          path.push(result[0].end.properties.name);

          for (let i = 1; i < result.length; i++) {
            path.push(result[i].end.properties.name);
          }
        }

        res.status(OK_STATUS)
            .send({path: path});
      });
};

const findAll = (req, res) => {
  Character.findAll()
      .then((result) => {
        res.status(OK_STATUS)
            .render('./pages/characters', {characters: result});
      });
};

const search = (req, res) => {
  Character.search(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({characters: result});
      });
};

const searchAll = (req, res) => {
  Character.searchAll()
      .then((result) => {
        res.status(OK_STATUS)
            .send({characters: result});
      });
};


export default {
  find,
  filmsCharacterAppeared,
  charactersInteractionInFilm,
  filmInWhichTwoCharacterSpeak,
  areAppearedToghether,
  charactersNotKnown,
  commonKnownCharacters,
  shortestPath,
  findAll,
  search,
  searchAll,
};
