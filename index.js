require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

let Urls = [];
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/", bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short', function(req, res) {
  let short = req.params.short;
  let data = Urls.filter((x) => x.short == short);
  res.redirect(data[0].url);
});

app.post('/api/shorturl', (req, res) => {
  let data = req.body.url;
  let isURL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(data);

  if (isURL) {
    let i = Math.floor(Math.random() * 999);
    let obj = { url: data, short: i };
    Urls.push(obj);
    res.json({ original_url: data, short_url: i });
  }
  else {
    res.json({ error: 'invalid url' });
  }

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
