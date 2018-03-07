const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');


module.exports = {
  entry: {
    // 'babel-polyfill',
    index: ['./src/js/index.tsx'],
  },
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
      '@shaders': path.resolve(__dirname, 'src/shaders'),
      '@thirdparty': path.resolve(__dirname, 'src/thirdparty')
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
      title: 'Paxton MFTS',
      template: './public/index.html',
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      preserveLineBreaks: false,
      removeAttributeQuotes: true,
      removeComments: true
    }),
    new WebpackPwaManifest({
      short_name: 'Paxton MFTS',
      name: 'Steve Paxton - Material for the spine',
      description: 'Material for the spine. Contredanse.org ',
      background_color: '#000000',
      theme_color: '#000000',
      start_url: "/",
      inject: true,
      fingerprints: true,
      ios: true,
      orientation: "portrait",
      display: "standalone",
      icons: [
        {
          src: path.resolve('src/assets/icons/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('icons')
        },
        {
          src: path.resolve('src/assets/icons/logo.png'),
          sizes: [120, 152, 167, 180, 1024],
          destination: path.join('icons', 'ios'),
          ios: true
        }
      ]
    }),
    new ManifestPlugin(
      {
        fileName: 'assets-manifest.json',
        basePath: '',
        hash: true
      }
    ),
    new HtmlWebpackHarddiskPlugin(),
  ]
};

