const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
