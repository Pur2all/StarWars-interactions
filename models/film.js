import driver from '../db.js';

class Film {
  constructor(film) {
    this.title = film.title;
    this.year = film.year;
  }

  static async find(filmTitle) {
    const session = driver.session();

    return session.run(
        'MATCH (film:Film {title: $title}) \
         RETURN film',
        {
          title: filmTitle,
        },
    )
        .then((result) => {
          session.close();

          return result.records[0].get('film').properties;
        });
  }

  static async findAll() {
    const session = driver.session();

    return session.run(
        'MATCH (film:Film) \
         RETURN film',
    )
        .then((result) => {
          session.close();

          return result.records.map((record) => record.get('film').properties);
        });
  }

  static async firstAppearenceHistory(characterName) {
    const session = driver.session();

    return session.run(
        'MATCH (c:Character)-[r:APPEARED_IN]-(film:Film) \
         WHERE c.name = $name \
         RETURN film \
         ORDER BY id(film) \
         LIMIT 1',
        {
          name: characterName,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((record) => record.get('film').properties);
        });
  }

  static async firstAppearencePub(characterName) {
    const session = driver.session();

    return session.run(
        'MATCH (c:Character)-[r:APPEARED_IN]-(film:Film) \
         WHERE c.name = $name \
         RETURN film \
         ORDER BY film.year \
         LIMIT 1',
        {
          name: characterName,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((record) => record.get('film').properties);
        });
  }

  static async firstMentionHistory(characterName) {
    const session = driver.session();

    return session.run(
        'MATCH (c:Character)-[r:MENTIONED_WITHIN_IN_THE_SAME_SCENE]-() \
         WHERE c.name = $name \
         RETURN r.film \
         ORDER BY r.film \
         LIMIT 1',
        {
          name: characterName,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((record) => record.get('r.film'));
        });
  }

  static async firstMentionPub(characterName) {
    const session = driver.session();

    return session.run(
        'MATCH (c:Character)-[r:MENTIONED_WITHIN_IN_THE_SAME_SCENE]-() \
         WHERE c.name = $name \
         WITH r.film as t \
         MATCH (f:Film ) \
         WHERE f.title = t \
         RETURN f \
         ORDER BY f.year \
         LIMIT 1',
        {
          name: characterName,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((record) => record.get('f').properties);
        });
  }

  /*
    Input: lista di film
    Output: personaggi che appaiono nei film
  */
  static async characterAppearedInFilm(filmTitles) {
    if (!filmTitles) {
      throw new Error('No filmTitle parameter');
    };

    const session = driver.session();

    return session.run(
        'MATCH (character:Character)-[r:APPEARED_IN]-(film:Film) \
         WHERE film.title in $filmList \
         RETURN DISTINCT character',
        {
          filmList: filmTitles,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('character').properties);
        });
  }

  /*
    Input: lista di film
    Output: personaggi che sono menzionati nei film specificati
  */
  static async characterMentionedInFilm(filmTitles) {
    if (!filmTitles) {
      throw new Error('No filmTitle parameter');
    };

    const session = driver.session();

    return session.run(
        'MATCH(character:Character)-[r:MENTIONED_WITHIN_IN_THE_SAME_SCENE]-(c) \
         WHERE r.film in $filmList \
         RETURN DISTINCT character',
        {
          filmList: filmTitles,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('character').properties);
        });
  }

  static async search(filmTitle) {
    const session = driver.session();

    return session.run(
        'MATCH (film:Film) \
         WHERE film.title =~ \'(?i).*$title.*\' \
         RETURN film',
        {
          title: filmTitle,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('film').properties);
        });
  }
}


export default Film;
