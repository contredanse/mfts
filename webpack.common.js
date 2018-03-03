const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  entry: [
   // 'babel-polyfill',
    './src/js/index.tsx',
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    alias: {
      '@src': path.resolve(__dirname, 'src/js/'),
      '@data': path.resolve(__dirname, 'src/data/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@public': path.resolve(__dirname, 'public/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@shaders': path.resolve(__dirname, 'src/shaders')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFilename: 'tsconfig.json',
              useBabel: true,
              useCache: true,
              silent: true,
            }
          }
        ]
      }
      /* OR if we like to chain and mix js and tsx
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            //options: babelOptions
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      },

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }*/
      ,{
        test: /\.(glsl|vs|fs)$/,
        loader: 'ts-shader-loader'
      },{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },{
        test: /\.(mp4|m4v|ogv|webm)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/videos/[name].[ext]',
        }
      },{
        test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$/,
        loader: 'file-loader',
        //use: 'url-loader?limit=10000',
        options: {
          name: 'fonts/[name].[ext]'
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]-[hash].[ext]',
            }
          }
        ]
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      hash: false,
      title: 'MFTS',
      myPageHeader: 'MFTS',
      template: './public/index.html',
    }),
    new HtmlWebpackHarddiskPlugin(),
    new ManifestPlugin(
      {
        fileName: 'manifest.json',
        basePath: '',
        seed: {
          "short_name": "Paxton MFTS",
          "name": "Steve Paxton - Material for the spine",
          "icons": [
            {
              "src": "favicon.ico",
              "sizes": "64x64 32x32 24x24 16x16",
              "type": "image/x-icon"
            }
          ],
          "start_url": "/",
          "display": "standalone",
          "theme_color": "#000000",
          "background_color": "#ffffff"
        }
      }
    )
  ]
};

