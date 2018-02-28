const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const extractSass = new ExtractTextPlugin({
  filename: "style.css",
});


module.exports = merge(common, {
  devtool: 'source-map', // or false if you don't want source map
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        })
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      NODE_ENV: JSON.stringify('production')
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new UglifyJsPlugin({
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        comments: false,
        //ecma: 5,
        compress: true,
        warnings: true
      }
    }),

    extractSass,

  ]
});


