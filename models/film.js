import driver from '../db.js';

class Film {
  constructor(film) {
    this.title = film.title;
    this.year = film.year;
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

  static async firstApearencePub(characterName) {
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

          return result.records.map((record) => record.get('film').properties);
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

          return result.records.map((record) => record.get('film').properties);
        });
  }
}


export default Film;
