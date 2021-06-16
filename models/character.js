import driver from '../db.js';

class Character {
    constructor(character) {
        this.name = character.name
        this.scenes = character.scenes
    }
    
    /* 
        Input: nome di un personaggio

    */
    static async filmsInWhichCharacterAppeared(characterName) {
        if(!characterName){
            throw new Error('No Parameters'); 
        }
        
        const session = driver.session();
        return session.run('MATCH (character:Character {name: $name})-[r:APPEARED_IN]->(film:Film)' +
                    'RETURN film',
                    {
                        name: characterName
                    }
                )
                .then((result)=>  {
                    session.close()
                    return result.records.map((r)=>r.get('film').properties)
                })
    }

    static async characterInteractionsInFilm(characterNames, filmName) {
        if(!characterNames)
            throw new Error('No characterNames parameter')

        if(!filmName)
            throw new Error('No filmName parameter')
        
        session.run('MATCH (character:Character)-[r:SPEAK_WITHIN_IN_THE_SAME_SCENE{film: $film}]-(c)' +
                    'WHERE character.name in $characters' +
                    'RETURN character, r, c',
                    {
                        characters: characterNames,
                        film: filmName
                    })
                    .then((result)=>{
                        console.log(result)
                    })
    }   


}


export default Character;