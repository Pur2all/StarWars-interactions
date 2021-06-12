import express from 'express'

var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/character/:characterName', function(req, res) {
  res.send('hello world');
});

app.get('/character/:characters/:filmTitle', function(req, res) {
    res.send('hello world');
  });

app.get('/character/speak/:characterNames', function(req, res) {
    res.send('hello world');
});

app.get('/film/appeared/firstTimeStory/:characterName', function(req, res) {
    res.send('hello world');
  });

  
app.get('/film/appeared/firstTimeFilmPub/:characterName', function(req, res) {
    res.send('hello world');
  });

app.get('/film/mentioned/firstTimeStory/:characterName', function(req, res) {
    res.send('hello world');
});


app.get('/film/mentioned/firstTimeFilmPub/:characterName', function(req, res) {
    res.send('hello world');
});


app.get('/character/speak/together/:characterNames', function(req, res) {
    res.send('hello world');
});

app.get('/film/:filmTitle', function(req, res) {
    res.send('hello world');
  });

app.get('/film/mentioned/:filmTitle', function(req, res) {
    res.send('hello world');
});

app.get('/film/appeared/:filmTitle', function(req, res) {
    res.send('hello world');
});

  
app.listen(3000, function(){
    console.log("Lodo è bello")
});