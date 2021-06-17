import sw1_char from './interactions/starwars-episode-1-interactions-allCharacters.json';
import sw1_mentions from './interactions/starwars-episode-1-mentions.json';
import sw2_char from './interactions/starwars-episode-2-interactions-allCharacters.json';
import sw2_mentions from './interactions/starwars-episode-1-mentions.json';
import sw3_char from './interactions/starwars-episode-3-interactions-allCharacters.json';
import sw3_mentions from './interactions/starwars-episode-3-mentions.json';
import sw4_char from './interactions/starwars-episode-4-interactions-allCharacters.json';
import sw4_mentions from './interactions/starwars-episode-4-mentions.json';
import sw5_char from './interactions/starwars-episode-5-interactions-allCharacters.json';
import sw5_mentions from './interactions/starwars-episode-5-mentions.json';
import sw6_char from './interactions/starwars-episode-6-interactions-allCharacters.json';
import sw6_mentions from './interactions/starwars-episode-6-mentions.json';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(process.env.DB_URI, neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
const session = driver.session();
const tx = session.beginTransaction();
const dataset = [[sw1_char, sw1_mentions],
  [sw2_char, sw2_mentions],
  [sw3_char, sw3_mentions],
  [sw4_char, sw4_mentions],
  [sw5_char, sw5_mentions],
  [sw6_char, sw6_mentions]];

const films = [
  {title: 'Star Wars Episode I - The Phantom Menace', year: 1999},
  {title: 'Star Wars Episode II - Attack of the Clones', year: 2002},
  {title: 'Star Wars Episode III - Revenge of the Sith', year: 2005},
  {title: 'Star Wars Episode IV - A New Hope', year: 1977},
  {title: 'Star Wars Episode V - The Empire Strikes Back', year: 1980},
  {title: 'Star Wars Episode VI - Return of the Jedi', year: 1983},
];

let filmNumber = 0;

films.forEach((film) => {
  tx.run(
      'CREATE (film:Film {title: $title, year: toInteger($year)})',
      {
        title: film.title,
        year: film.year,
      },
  )
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
});

dataset.forEach((element) => {
  const [char, mentions] = element;
  const filmTitle = films[filmNumber++].title;

  char.nodes.forEach(async (character) => {
    try {
      await tx.run(
          'MERGE (character:Character {name: $name}) \
                 WITH character \
                 MATCH (film:Film) \
                 WHERE film.title = $title \
                 CREATE (character)-[r:APPEARED_IN {numberOfScenes: $scenes}]->(film)',
          {
            name: character.name,
            scenes: character.value,
            title: filmTitle,
          },
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

  char.links.forEach(async (link) => {
    const sourceChar = char.nodes[link.source].name;
    const targetChar = char.nodes[link.target].name;

    try {
      await tx.run(
          'MATCH (source:Character), (target:Character) \
                 WHERE source.name = $sourceName AND target.name = $targetName \
                 CREATE (source)-[r:SPEAK_WITHIN_IN_THE_SAME_SCENE {times: $times, film: $film}]->(target)',
          {
            sourceName: sourceChar,
            targetName: targetChar,
            times: link.value,
            film: filmTitle,
          },
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

  mentions.links.forEach(async (link) => {
    const sourceChar = mentions.nodes[link.source].name;
    const targetChar = mentions.nodes[link.target].name;

    try {
      await tx.run(
          'MATCH (source:Character), (target:Character) \
                 WHERE source.name = $sourceName AND target.name = $targetName \
                 CREATE (source)-[r:MENTIONED_WITHIN_IN_THE_SAME_SCENE {times: $times, film: $film}]->(target)',
          {
            sourceName: sourceChar,
            targetName: targetChar,
            times: link.value,
            film: filmTitle,
          },
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
});

tx.commit()
    .then(() => session.close())
    .then(() => process.exit(0));
