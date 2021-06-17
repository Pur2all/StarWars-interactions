import express from 'express';
import dotenv from 'dotenv';
import characterService from './services/characterService.js';
import filmService from './services/filmService.js';

dotenv.config();

const port = process.env.EXPRESS_PORT || 3000;
const app = express();

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile('homepage.html', {root: './page'});
});

app.listen(port, function() {
  console.log('Server started on port ' + port);
});

characterService(app);
filmService(app);
