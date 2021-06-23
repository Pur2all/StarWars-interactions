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
import cheerio from 'cheerio';

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

const charactersImg = {
  'Nute Gunray': 'https://static.wikia.nocookie.net/starwars/images/f/fd/Nute_Gunray_SWE.png/revision/latest?cb=20170615051121',
  'PK-4': 'https://static.wikia.nocookie.net/starwars/images/d/de/Pk-worker_negtd.jpg/revision/latest/top-crop/width/360/height/450?cb=20071013153209',
  'TC-14': 'https://static.wikia.nocookie.net/starwars/images/4/4a/TC_14_A.jpg/revision/latest/scale-to-width-down/250?cb=20200929090118&path-prefix=it',
  'DOFINE': 'https://static.wikia.nocookie.net/villains/images/9/9b/Daultay_Dofine.jpg/revision/latest?cb=20180114122214&path-prefix=it',
  'RUNE': 'data:image/jpeg;base64,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',
  'TEY HOW': 'https://static.wikia.nocookie.net/starwars/images/0/0a/Tey_How.png/revision/latest?cb=20160916204209',
  'Quarsh Panaka': 'http://www.swx.it/databank/images/2/28/Panaka_btm.jpg',
  'SIO BIBBLE': 'https://static.wikia.nocookie.net/starwars/images/3/37/Sio_Bibble_SWE.png/revision/latest/top-crop/width/360/height/450?cb=20140529030623',
  'Roos Tarpals': 'https://static.wikia.nocookie.net/starwars/images/c/ca/TarpalsHS.jpg/revision/latest?cb=20180218034913',
  'Rugor Nass': 'data:image/jpeg;base64,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',
  'Padmé Amidala': 'data:image/jpeg;base64,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',
  'Ric Olié': 'http://images4.wikia.nocookie.net/__cb20070320164856/starwars/nl/images/d/de/Ric_Olie1.jpg',
  'Sebulba': 'https://static.wikia.nocookie.net/starwars/images/c/c4/Sebulbaprmo.jpg/revision/latest/scale-to-width-down/975?cb=20141011214614&path-prefix=it',
  'JIRA': 'https://static.wikia.nocookie.net/starwars/images/1/10/Jira.png/revision/latest?cb=20130121045600',
  'Shmi Skywalker': 'https://static.wikia.nocookie.net/starwars/images/a/ad/ShmiSkywalkerDatabank_%28Repurposed%29.jpeg/revision/latest?cb=20171114023541',
  'KITSTER': 'https://static.wikia.nocookie.net/starwars/images/1/1f/Kitster.jpg/revision/latest/top-crop/width/360/height/450?cb=20171028004542',
  'WALD': 'https://static.wikia.nocookie.net/banthapedia/images/9/9b/Wald.jpg/revision/latest/scale-to-width-down/250?cb=20110318182906',
  'FODE/BEED': 'https://static.wikia.nocookie.net/starwars/images/9/98/Fodeinbeedpromo.jpg/revision/latest/top-crop/width/360/height/450?cb=20111210202737',
  'Finis Valorum': 'https://static.wikia.nocookie.net/starwars/images/8/89/Valorum.jpg/revision/latest?cb=20141031190120&path-prefix=it',
  'Ki-Adi-Mundi': 'https://static.wikia.nocookie.net/starwars/images/d/d4/250px-KiAdiMundi.jpg/revision/latest?cb=20090417101043&path-prefix=it',
  'RABE': 'https://static.wikia.nocookie.net/starwars/images/8/8e/Rabe.png/revision/latest?cb=20140208153518',
  'GENERAL CEEL': 'https://static.wikia.nocookie.net/starwars/images/8/85/Generalceel.jpg/revision/latest/scale-to-width-down/350?cb=20140211183006',
  'BRAVO TWO': 'https://static.wikia.nocookie.net/starwars/images/6/63/Dolphe.jpg/revision/latest?cb=20061130081637',
  'BRAVO THREE': 'https://static.wikia.nocookie.net/starwars/images/9/91/Arven_wendik.jpg/revision/latest?cb=20111001153006',
  'Gregar Typho': 'https://static.wikia.nocookie.net/starwars/images/5/52/Gregar_Typho.jpg/revision/latest?cb=20090903192036',
  'SENATOR ASK AAK': 'https://static.wikia.nocookie.net/starwars/images/a/ab/AskAaakDatabank.jpeg/revision/latest?cb=20180115235202',
  'ORN FREE TAA': 'https://static.wikia.nocookie.net/starwars/images/7/70/OrnFreeTaaHS-SWE.jpg/revision/latest?cb=20111117031510',
  'SOLA': 'https://static.wikia.nocookie.net/starwars/images/d/df/SolaNaberrieFuneral.jpg/revision/latest/top-crop/width/360/height/360?cb=20130321125146',
  'JOBAL': 'https://static.wikia.nocookie.net/starwars/images/a/ab/JobalNaberrieFuneral.jpg/revision/latest/top-crop/width/360/height/450?cb=20130321135618',
  'RUWEE': 'http://www.swx.it/databank/images/thumb/2/27/Ruwee.jpg/250px-Ruwee.jpg',
  'Taun We': 'https://static.wikia.nocookie.net/starwars/images/9/9c/TaunWe.jpg/revision/latest?cb=20080117164920',
  'Lama Su': 'https://cloud10.todocoleccion.online/figuras-munecos-star-wars/tc/2011/09/25/28631394.jpg',
  'Owen Lars': 'https://static.wikia.nocookie.net/starwars/images/e/eb/OwenCardTrader.png/revision/latest?cb=20171108050140',
  'Beru Whitesun lars': 'https://static.wikia.nocookie.net/starwars/images/c/cc/250px-Beru_headshot2.jpg/revision/latest/scale-to-width-down/250?cb=20101021195250&path-prefix=it',
  'Cliegg Lars': 'https://static.wikia.nocookie.net/starwars/images/2/2c/Cliegg_Lars.jpg/revision/latest?cb=20170930204930&path-prefix=it',
  'SUN RIT': 'https://static.wikia.nocookie.net/starwars/images/f/fc/Fac.jpg/revision/latest/top-crop/width/360/height/450?cb=20070525180804',
  'Poggle the Lesser': 'https://static.wikia.nocookie.net/theclonewiki/images/a/a9/PoggleTheLesser.png/revision/latest?cb=20170619213112',
  'Plo Koon': 'https://static.wikia.nocookie.net/starwars/images/b/bf/PloKoonCardTrader.png/revision/latest?cb=20180213154354',
  'ODD BALL': 'http://pm1.narvii.com/6582/eb4d4b1fd9ed2994c792886e1ec8fc99da886f2c_00.jpg',
  'FANG ZAR': 'https://static.wikia.nocookie.net/starwars/images/3/33/Fangzar.jpg/revision/latest?cb=20080626151330',
  'Mon Mothma': 'https://static.wikia.nocookie.net/starwars/images/4/46/Monmothma.jpg/revision/latest?cb=20090617130139&path-prefix=it',
  'GIDDEAN DANU': 'http://www.swx.it/databank/images/thumb/a/ae/Giddean_1.jpg/250px-Giddean_1.jpg',
  'CLONE COMMANDER GREE': 'https://i.pinimg.com/originals/36/58/26/365826c5971891bed6e383eaf68f3bef.jpg',
  'CLONE COMMANDER CODY': 'https://lumiere-a.akamaihd.net/v1/images/databank_clonecommandercody_01_169_f3aa1a91.jpeg?region=0%2C49%2C1560%2C780',
  'Tion Medon': 'https://static.wikia.nocookie.net/starwars/images/4/43/Tion_Medon.jpg/revision/latest?cb=20091130182814',
  'Raymus Antilles': 'https://static.wikia.nocookie.net/starwars/images/6/61/RaymusAntilles.jpg/revision/latest?cb=20131022202137&path-prefix=it',
  'CAMIE': 'https://static.wikia.nocookie.net/starwars/images/e/ec/Camie-SWCT.png/revision/latest?cb=20180922044436',
  'MOTTI': 'https://static.wikia.nocookie.net/starwars/images/b/b6/Admiral_Motti.png/revision/latest?cb=20140103204056',
  'DODONNA': 'https://static.wikia.nocookie.net/starwars/images/1/1e/Jan_Dodonna-SW_Card_Trader.png/revision/latest?cb=20161226222547',
  'GOLD LEADER': 'https://static.wikia.nocookie.net/starwars/images/2/22/JonVander-ANH.png/revision/latest?cb=20130303150104',
  'RED LEADER': 'https://static.wikia.nocookie.net/starwars/images/1/1c/AwesomeDave-ANHHD.jpg/revision/latest?cb=20111104223659',
  'RED TEN': 'https://static.wikia.nocookie.net/starwars/images/2/2b/Theron_Nett.png/revision/latest?cb=20130306051842',
  'GOLD FIVE': 'https://static.wikia.nocookie.net/starwars/images/f/f4/Davish_krail.jpg/revision/latest/top-crop/width/360/height/450?cb=20111104223721',
  'RIEEKAN': 'https://static.wikia.nocookie.net/starwars/images/a/a0/Rieekan.jpg/revision/latest?cb=20080327192243',
  'DERLIN': 'https://static.wikia.nocookie.net/starwars/images/7/7f/Brenderlin.jpg/revision/latest?cb=20080328131308',
  'ZEV': 'https://static.wikia.nocookie.net/starwars/images/b/b2/ZevSenescaHS-TESB.png/revision/latest?cb=20130219053912',
  'PIETT': 'https://static.wikia.nocookie.net/starwars/images/8/8b/Piett_btm.jpg/revision/latest?cb=20090620153856&path-prefix=it',
  'OZZEL': 'https://static.wikia.nocookie.net/starwars/images/9/90/Ozzel.jpg/revision/latest/scale-to-width-down/250?cb=20090620113358&path-prefix=it',
  'DACK': 'https://static.wikia.nocookie.net/starwars/images/8/82/Dackralter.jpg/revision/latest/top-crop/width/360/height/450?cb=20051028005822',
  'JANSON': 'https://static.wikia.nocookie.net/starwars/images/8/89/Day9ianliston.jpg/revision/latest?cb=20080317203407',
  'NEEDA': 'http://www.swx.it/databank/images/thumb/9/96/Needa_1.jpg/250px-Needa_1.jpg',
  'JERJERROD': 'https://static.wikia.nocookie.net/starwars/images/2/28/Jerjerrod.jpg/revision/latest?cb=20141128135138&path-prefix=it',
  'BOUSHH': 'https://static.wikia.nocookie.net/starwars/images/4/49/Leia_Organ_Boushh_AtG.png/revision/latest?cb=20181206071111',
  'ADMIRAL ACKBAR': 'https://static.wikia.nocookie.net/starwars/images/2/29/Admiral_Ackbar_RH.png/revision/latest?cb=20170907053204',

};

(async () => {
  await tx.run(
      'MATCH (n) DETACH DELETE n',
  );

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

  await (async () => {
    const result = await tx.run(
        'MATCH (character:Character) \
       RETURN character',
    );
    const characterList = result.records.map((record) => record.get('character').properties);

    const promises = characterList.map(async (character) => {
      let characterProps;

      try {
        const responseProps = await axios.get('https://swapi.dev/api/people/?search=' + character.name);

        characterProps = responseProps.data.results[0];

        delete characterProps.homeworld;
        delete characterProps.films;
        delete characterProps.species;
        delete characterProps.vehicles;
        delete characterProps.starships;
        delete characterProps.created;
        delete characterProps.edited;
        delete characterProps.url;
      } catch (error) {
        console.log('Some info not found for character ' + character.name);
      }
      try {
        const html = await axios.get('https://en.wikipedia.org/wiki/' + (characterProps != undefined ? characterProps.name : character.name));
        const $ = cheerio.load(html.data);

        const image = $('.infobox-image')
            .find('img')
            .attr('src');

        if (image == undefined) {
          throw new Error('No image');
        }

        if (characterProps == undefined) {
          characterProps = {};
        }

        characterProps.image = image;
      } catch (error) {
        console.log('Cannot find image for character: ' + ((characterProps != undefined && characterProps.name != undefined) ? characterProps.name : character.name));
      }
      if (characterProps != undefined) {
        return tx.run(
            'MATCH (character:Character {name: $name}) \
           SET character = $props',
            {
              name: character.name,
              props: characterProps,
            },
        );
      }
    });

    await Promise.all(promises);
    await tx.commit();
    await session.close();
  })();
})()
    .then(() => {
      console.log('Database populated');
      process.exit(0);
    })
    .catch((err) => console.log(err));
