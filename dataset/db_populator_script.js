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

session.run(
    'CREATE (a:Person {name: $name}) RETURN a',
    { name: 'Alberto mi diverto' }
)
.then(data => console.log(data)) 
.catch(err => console.log(err))