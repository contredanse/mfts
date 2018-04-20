const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractSass = new MiniCssExtractPlugin({
    filename: "style.[contenthash:8].css",
});

module.exports = merge(common, {
    devtool: 'hidden-source-map', // or false if you don't want source map
    mode: 'production',
    entry: [// 'babel-polyfill',
        './src/js/index.tsx',
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash:8].bundle.js',
        chunkFilename: '[name].[chunkhash:8].bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            sourceMap: false,
                            modules: false, // use CSS-Modules to scope styles
                            importLoader: 2
                        }
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            config: {
                                path: path.resolve(__dirname, 'postcss.config.js')
                            }
                        },
                    },
                    {
                        loader: "sass-loader", // compiles Sass to CSS
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: false,
                            sourceMapContents: false
                        }
                    }
                ],
            }
        ]
    },

    optimization: {
        //namedModules: true, // NamedModulesPlugin(), will increase size
        runtimeChunk: false,

        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'initial',
                    enforce: true,
                    minSize: 0,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all'
                }
            }
        },

        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        //concatenateModules: true, //ModuleConcatenationPlugin

        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        dead_code: true,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            }),


            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),

                cssProcessorOptions: {
                    //map: { inline: false, },
                    discardUnused: {
                        fontFace: false, // to not remmove additional @font-face
                    },
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true
            })
        ]
    },


    plugins: [
        new CleanWebpackPlugin('dist', {} ),
        //new PrepackWebpackPlugin({}),

        new webpack.EnvironmentPlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            NODE_ENV: JSON.stringify('production')
        }),

/*
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),*/

        extractSass,

        new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: true,
        }),

        new StatsWriterPlugin({
            filename: '.webpack-stats.json'
        }),

    ]
});


