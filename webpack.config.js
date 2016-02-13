var path = require('path');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const PATHS = {
  client: path.join(__dirname, 'client'),
  build: path.join(__dirname, 'public')
};

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: './client/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: PATHS.client
      }
    ]
  },
  plugins: [
    new NpmInstallPlugin({save: true})
  ]
};
