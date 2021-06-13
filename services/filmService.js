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
