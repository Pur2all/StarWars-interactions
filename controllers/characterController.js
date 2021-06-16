import character from '../models/character.js';

const films = (req, res) => {
    character.filmsInWhichCharacterAppeared('HAN')
    .then((result)=>{
        res.status(200).send({films: result});
    })
}


export default {
    films
}