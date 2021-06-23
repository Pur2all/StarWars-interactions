import driver from '../db.js';

class Character {
  constructor(character) {
    this.name = character.name;
    this.scenes = character.scenes;
  }

  static async find(characterName) {
    const session = driver.session();

    return session.run(
        'MATCH (character:Character {name: $name}) \
         RETURN character',
        {
          name: characterName,
        },
    )
        .then((result) => {
          session.close();

          return result.records[0].get('character').properties;
        });
  }

  /*
        Input: nome di un personaggio
        Output: lista dei film in cui il personaggio appare
    */
  static async filmsInWhichCharacterAppeared(characterName) {
    if (!characterName) {
      throw new Error('No Parameters');
    }

    const session = driver.session();

    return session.run('MATCH (character:Character {name: $name})-[r:APPEARED_IN]->(film:Film)' +
                           'RETURN film',
    {
      name: characterName,
    },
    )
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('film').properties);
        });
  }

  /*
        Input: lista nomi personaggio (list) e titolo di un film (f)
        Output: lista delle interazioni dei personaggi nella lista 'list' nel film 'f'
    */
  static async characterInteractionsInFilm(characterNames, filmName) {
    if (!characterNames) {
      throw new Error('No characterNames parameter');
    };

    if (!filmName) {
      throw new Error('No filmName parameter');
    };


    const session = driver.session();

    return session.run('MATCH (character:Character)-[r:SPEAK_WITHIN_IN_THE_SAME_SCENE{film:$film}]-(c) ' +
                    'WHERE character.name in $characters ' +
                    'RETURN character, r, c',
    {
      characters: characterNames,
      film: filmName,
    })
        .then((result) => {
          const c1 = result.records.map((r) => r.get('character').properties);
          const r = result.records.map((r) => r.get('r').properties);
          const c2 = result.records.map((r) => r.get('c').properties);

          const zip = (a, b, c) => a.map((k, i) => [k, b[i], c[i]]);


          const speakWith = zip(c1, r, c2);

          session.close();

          return speakWith;
        });
  }

  /*
        Input: 2 nomi
        Output: film in cui i due personaggi compaiono insieme e numero di volte in cui accade
    */
  static async timesTwoCharactersAppearToghether(characterName1, characterName2) {
    if (!characterName1) {
      throw new Error('No characterName1 parameter');
    };

    if (!characterName2) {
      throw new Error('No characterName2 parameter');
    };

    const session = driver.session();

    return session.run('MATCH (c1:Character)-[r:SPEAK_WITHIN_IN_THE_SAME_SCENE]-(c2:Character) ' +
                    'WHERE c1.name = $name1 AND c2.name = $name2 ' +
                    'RETURN c1, collect(r.film), c2, sum(r.times)', {
      name1: characterName1,
      name2: characterName2,
    })
        .then((result) => {
          session.close();

          const films = result.records.map((r) => r.get('collect(r.film)'));
          const sum = result.records.map((r) => r.get('sum(r.times)'));

          const zip = (a, b) => a.map((k, i) => [k, b[i]]);
          const timeSpeaks = zip(films, sum);

          return timeSpeaks;
        });
  }
  /*
      Input: 2 nomi
      Output: true se i due personaggi hanno parlato insieme, false altrimenti
   */
  static async charactersAreAppearedToghether(characterName1, characterName2) {
    if (!characterName1) {
      throw new Error('No characterName1 parameter');
    };

    if (!characterName2) {
      throw new Error('No characterName2 parameter');
    };

    const session = driver.session();

    return session.run('RETURN exists((:Character{name :$name1})-[:SPEAK_WITHIN_IN_THE_SAME_SCENE]-(:Character{name: $name2})) as e',
        {
          name1: characterName1,
          name2: characterName2,
        })
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('e'));
        });
  }

  static async charactersNotKnown(characterName) {
    const session = driver.session();

    return session.run('MATCH (n:Character {name: $name}), (m:Character) \
                        WHERE NOT (n)-[]-(m) AND m.name <> n.name \
                        RETURN m',
    {
      name: characterName,
    })
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('m').properties);
        });
  }

  static async commonKnownCharacters(firstCharacterName, secondCharacterName) {
    const session = driver.session();

    return session.run('MATCH (n:Character {name: $name1})-[:SPEAK_WITHIN_IN_THE_SAME_SCENE]-(m:Character) \
                        WITH collect(m.name) AS result \
                        MATCH (n:Character {name: $name2})-[:SPEAK_WITHIN_IN_THE_SAME_SCENE]-(m) \
                        WHERE m.name IN result \
                        RETURN m',
    {
      name1: firstCharacterName,
      name2: secondCharacterName,
    })
        .then((result) => {
          session.close();

          return result.records.map((record) => record.get('m').properties);
        });
  }

  static async shortestPath(fromName, toName) {
    const session = driver.session();

    return session.run('MATCH (from:Character {name: $from}), (to:Character {name: $to}) \
                        CALL apoc.algo.dijkstra(from, to, \'SPEAK_WITHIN_IN_THE_SAME_SCENE\', \'null\', 1) \
                        YIELD path \
                        RETURN path',
    {
      from: fromName,
      to: toName,
    })
        .then((result) => {
          session.close();

          return result.records[0].get('path').segments;
        });
  }

  static async findAll() {
    const session = driver.session();

    return session.run(
        'MATCH (characters:Character) \
         RETURN characters')
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('characters').properties);
        });
  }

  static async search(characterName) {
    const session = driver.session();

    return session.run(
        'MATCH (characters:Character) \
         WHERE characters.name =~ \'(?i).*$name.*\' \
         RETURN characters',
        {
          name: characterName,
        },
    )
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('characters').properties);
        });
  }

  static async searchAll() {
    const session = driver.session();

    return session.run(
        'MATCH (characters:Character) \
         RETURN characters',
    )
        .then((result) => {
          session.close();

          return result.records.map((r) => r.get('characters').properties);
        });
  }
}


export default Character;
