import sw1Char from './interactions/starwars-episode-1-interactions-allCharacters.json';
import sw1Mentions from './interactions/starwars-episode-1-mentions.json';
import sw2Char from './interactions/starwars-episode-2-interactions-allCharacters.json';
import sw2Mentions from './interactions/starwars-episode-1-mentions.json';
import sw3Char from './interactions/starwars-episode-3-interactions-allCharacters.json';
import sw3Mentions from './interactions/starwars-episode-3-mentions.json';
import sw4Char from './interactions/starwars-episode-4-interactions-allCharacters.json';
import sw4Mentions from './interactions/starwars-episode-4-mentions.json';
import sw5Char from './interactions/starwars-episode-5-interactions-allCharacters.json';
import sw5Mentions from './interactions/starwars-episode-5-mentions.json';
import sw6Char from './interactions/starwars-episode-6-interactions-allCharacters.json';
import sw6Mentions from './interactions/starwars-episode-6-mentions.json';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const driver = neo4j.driver(process.env.DB_URI, neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
const session = driver.session();
const tx = session.beginTransaction();
const dataset = [
  [sw1Char, sw1Mentions],
  [sw2Char, sw2Mentions],
  [sw3Char, sw3Mentions],
  [sw4Char, sw4Mentions],
  [sw5Char, sw5Mentions],
  [sw6Char, sw6Mentions],
];

const films = [
  {title: 'Star Wars Episode I - The Phantom Menace', year: 1999, imgLink: 'https://i.ibb.co/XDKp8tN/I.webp'},
  {title: 'Star Wars Episode II - Attack of the Clones', year: 2002, imgLink: 'https://i.ibb.co/fC9J0cD/II.webp'},
  {title: 'Star Wars Episode III - Revenge of the Sith', year: 2005, imgLink: 'https://i.ibb.co/F5XMmR9/III.webp'},
  {title: 'Star Wars Episode IV - A New Hope', year: 1977, imgLink: 'https://i.ibb.co/wpZ9wjP/IV.webp'},
  {title: 'Star Wars Episode V - The Empire Strikes Back', year: 1980, imgLink: 'https://i.ibb.co/x8FkPpc/V.webp'},
  {title: 'Star Wars Episode VI - Return of the Jedi', year: 1983, imgLink: 'https://i.ibb.co/M8Zxd9J/VI.webp'},
];

let filmNumber = 0;

films.forEach((film) => {
  tx.run(
      'CREATE (film:Film {title: $title, year: toInteger($year), imgLink: $imgLink})',
      {
        title: film.title,
        year: film.year,
        imgLink: film.imgLink,
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

(async () => {
  const result = await tx.run(
      'MATCH (character:Character) \
       RETURN character',
  );
  const characterList = result.records.map((record) => record.get('character').properties);

  const promises = characterList.map(async (character) => {
    try {
      const response = await axios.get('https://swapi.dev/api/people/?search=' + character.name);
      const characterProp = response.data.results[0];

      delete characterProp.homeworld;
      delete characterProp.films;
      delete characterProp.species;
      delete characterProp.vehicles;
      delete characterProp.starships;
      delete characterProp.created;
      delete characterProp.edited;
      delete characterProp.url;

      return tx.run(
          'MATCH (character:Character {name: $name}) \
           SET character = $props',
          {
            name: character.name,
            props: characterProp,
          },
      );
    } catch (error) {
      console.log('Info not found for character ' + character.name);
    }
  });

  await Promise.all(promises);
  await tx.commit();
  await session.close();
})()
    .then(() => {
      console.log('Database populated');
      process.exit(0);
    })
    .catch((err) => console.log(err));
