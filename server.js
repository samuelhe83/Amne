const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');
const app = express();

const compiler = webpack(config);

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })
);

app.use(require('webpack-hot-middleware')(compiler));

app.use(morgan('dev'));
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
