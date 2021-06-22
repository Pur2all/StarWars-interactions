import Film from '../models/film.js';

const OK_STATUS = 200;


const find = (req, res) => {
  Film.find(req.params.filmTitle)
      .then((result) => {
        res.status(OK_STATUS)
            .render('./pages/film', {film: result});
      });
};

const findAll = (req, res) => {
  Film.findAll()
      .then((result) => {
        res.status(OK_STATUS)
            .render('./pages/films', {films: result});
      });
};

const firstAppearanceOfCharacterOrderByHistory = (req, res) => {
  Film.firstAppearenceHistory(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({film: result});
      });
};

const firstAppearanceOfCharacterOrderByPub = (req, res) => {
  Film.firstAppearencePub(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({film: result});
      });
};

const firstMentionOfCharacterOrderByHistory = (req, res) => {
  Film.firstMentionHistory(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({film: result});
      });
};

const firstMentionOfCharacterOrderByPub = (req, res) => {
  Film.firstMentionPub(req.params.characterName)
      .then((result) => {
        res.status(OK_STATUS)
            .send({film: result});
      });
};

const charactersMentionedInFilms = (req, res) => {
  const filmsList = req.params.film.split(',');

  Film.mentionedInFilms(filmsList)
      .then((result) => {
        res.status(OK_STATUS)
            .send({characters: result});
      });
};

const charactersAppearedInFilms = (req, res) => {
  const filmsList = req.params.film.split(',');

  Film.characterAppearedInFilm(filmsList)
      .then((result) => {
        res.status(OK_STATUS)
            .send({characters: result});
      });
};

const search = (req, res) => {
  Film.search(req.params.filmTitle)
      .then((result) => {
        res.status(OK_STATUS)
            .send({films: result});
      });
};

export default {
  find,
  findAll,
  firstAppearanceOfCharacterOrderByHistory,
  firstAppearanceOfCharacterOrderByPub,
  firstMentionOfCharacterOrderByHistory,
  firstMentionOfCharacterOrderByPub,
  charactersMentionedInFilms,
  charactersAppearedInFilms,
  search,
};
