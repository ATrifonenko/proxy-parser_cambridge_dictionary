const express = require('express');
const app = express();
const parser = require('./parser');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:name', async function (req, res) {
  const word = req.params.name;
  const result = await parser(word);
  res.send(result);
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
