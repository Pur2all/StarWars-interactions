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
                 [sw6_char, sw6_mentions]]

dataset.forEach(element => {
    const [char, mentions] = element;

    char.nodes.forEach(async character => {

        await tx.run(
            'CREATE (character:Character {name: $name, numberOfScenesAppearedIn: $scenes})',
            {
                name: character.name,
                scenes: character.value
            }
        )
    })
    
    char.links.forEach(async link => {
        const sourceChar = char.nodes[link.source].name;
        const targetChar = char.nodes[link.target].name;
    
        await tx.run(
            'MATCH (source:Character), (target:Character) \
                WHERE source.name = $sourceName AND target.name = $targetName \
                CREATE (source)-[r:SPEAK_WITHIN_IN_THE_SAME_SCENE {times: $times}]->(target)',
            {
                sourceName: sourceChar,
                targetName: targetChar,
                times: link.value
            }
        )
    })
    
    mentions.links.forEach(async link => {
        const sourceChar = mentions.nodes[link.source].name;
        const targetChar = mentions.nodes[link.target].name;
    
        await tx.run(
            'MATCH (source:Character), (target:Character) \
                WHERE source.name = $sourceName AND target.name = $targetName \
                CREATE (source)-[r:MENTIONED_WITHIN_IN_THE_SAME_SCENE {times: $times}]->(target)',
            {
                sourceName: sourceChar,
                targetName: targetChar,
                times: link.value
            }
        )
    })
})

tx.commit()
.then(() => session.close())
.then(() => process.exit(0))