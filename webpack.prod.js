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

const extractSass = new MiniCssExtractPlugin({
    filename: "style.[contenthash:6].css",
    chunkFilename: "[name].css"
});

module.exports = merge(common, {
    devtool: 'source-map', // or false if you don't want source map
    mode: 'production',
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            sourceMap: true,
                            modules: false, // use CSS-Modules to scope styles
                            importLoader: 1
                        }
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: path.resolve(__dirname, 'postcss.config.js')
                            }
                        },
                    },
                    {
                        loader: "sass-loader", // compiles Sass to CSS
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }
                ],
            }
        ]
    },

    optimization: {
        //namedModules: true, // NamedModulesPlugin(), will increase size
        /*
        splitChunks: { // CommonsChunkPlugin()
            name: 'vendor',
            minChunks: 2
        },*/
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
                        /*
                        unsafe_comps: true,
                        properties: true,
                        keep_fargs: false,
                        pure_getters: true,
                        collapse_vars: true,
                        unsafe: true,
                        warnings: false,
                        sequences: true,
                        */
                        dead_code: true,
                        drop_debugger: true,
                        /*
                        comparisons: true,
                        conditionals: true,
                        evaluate: true,
                        booleans: true,
                        loops: true,
                        unused: true,
                        hoist_funs: true,
                        if_return: true,
                        join_vars: true,
                        */
                        drop_console: true
                    }
                }
            }),

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
            })
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


