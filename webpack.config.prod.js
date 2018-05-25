const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const appDir = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDir, relativePath);

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  devtool: false,
  bail: true,

  entry: [resolve('src/server.js')],

  output: {
    path: resolve('build'),
    filename: 'graphql.server.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    strictExportPresence: true,

    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              envName: 'server',
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },

  stats: {
    colors: true,
    assets: true,
    modules: false,
    builtAt: false,
    source: false,
    children: false,
  },
};
