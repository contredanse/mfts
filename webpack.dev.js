const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const extractSass = new ExtractTextPlugin({
  filename: "style.css",
});

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  //context: path.resolve(__dirname),
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ['css-hot-loader'].concat(extractSass.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        }))
      },
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    extractSass,
    /*
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    })
    */
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    port: 3001,
    historyApiFallback: true,
    hot: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
  }
});