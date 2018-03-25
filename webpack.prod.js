const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
//const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "style.[contenthash:6].css",
});

module.exports = merge(common, {
    devtool: 'source-map', // or false if you don't want source map
    entry: [// 'babel-polyfill',
        './src/js/index.tsx',
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: extractSass.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: [{
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    }, {
                        // Runs compiled CSS through postcss for vendor prefixing
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader", // compiles Sass to CSS
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }]
                })
            }
        ]
    },
    plugins: [
        //new PrepackWebpackPlugin({}),
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
                //ecma: 6,
                warnings: false,
                compress: {
                    drop_debugger: true,
                    drop_console: true
                },
                output: {
                    comments: false,
                    beautify: false,
                },
                ie8: false,
                safari10: false,
            }

        }),

        extractSass,

        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),

        new DuplicatePackageCheckerPlugin({
            verbose: true
        }),

        new StatsWriterPlugin({
            filename: '.webpack-stats.json'
        }),

    ]
});


