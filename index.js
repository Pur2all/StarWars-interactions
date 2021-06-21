import express from 'express';
import dotenv from 'dotenv';
import characterService from './services/characterService.js';
import filmService from './services/filmService.js';

dotenv.config();

const port = process.env.EXPRESS_PORT || 3000;
const app = express();

app.use(express.static('public'));

// set the view engine to ejs (serve per far funzionare le ejs nei progetti express)
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('./pages/homepage');
});
/*app.get('/films', function(req, res) {
  res.render('./pages/films');
});
app.get('/personaggi', function(req, res) {
  res.render('./pages/personaggi');
});*/
app.get('/film', function(req, res) {
  res.render('./pages/film');
});
app.get('/personaggio', function(req, res) {
  res.render('./pages/personaggio');
});
app.listen(port, function() {
  console.log('Server started on port ' + port);
});

characterService(app);
filmService(app);
