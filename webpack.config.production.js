var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/index.js',

  output: {
    filename: 'static/bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false
    })
  ]
};
