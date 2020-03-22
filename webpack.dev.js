const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const DotenvPlugin = require('dotenv-webpack');
const Dotenv = require('dotenv');
const fs = require('fs');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const dotEnvFile = fs.existsSync('.env.development.local') ? './.env.development.local' : './env/env-template';

Dotenv.config({
    path: dotEnvFile,
});

const socialMediaPicture = process.env.SOCIAL_MEDIA_PICTURE;
const PUBLIC_URL = process.env.PUBLIC_URL;

module.exports = merge(common, {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        // for webpack-dev-server only !
        publicPath: '/public/build/',
    },
    //context: path.resolve(__dirname),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader', // For polyfilling
                        options: {
                            cacheDirectory: false,
                            // plugins: ['react-hot-loader/babel'], in babelrc
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.dev.json',
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.(s?css)$/,
                use: ['css-hot-loader', 'style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name]-[hash].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.woff$|\.woff2?$/,
                loader: 'file-loader',
                //use: 'url-loader?limit=10000',

                options: {
                    limit: 50000,
                    mimetype: 'application/font-woff',
                    name: 'fonts/[name].[ext]',
                },
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: 'tsconfig.dev.json',
        }),
        new DotenvPlugin({
            path: dotEnvFile, // load this now instead of the ones in '.env'
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: false, // hide any errors
        }),

        /*
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
        */
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            hash: false,
            template: './public/index.html',
            templateParameters: {
                socialMediaPicture: socialMediaPicture,
                publicUrl: PUBLIC_URL,
                title: "Steve Paxton's Material for the spine",
            },
            removeAttributeQuotes: false,
            removeComments: false,
            minify: {
                collapseWhitespace: false,
                collapseInlineTagWhitespace: false,
            },
        }),

        new HtmlWebpackHarddiskPlugin(),
    ],
    optimization: {
        namedModules: true, // NamedModulesPlugin()
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        port: 3001,
        // to allow devserver to be accessed from multiple
        // machines. Be aware it's a security risk too
        disableHostCheck: true,
        host: '0.0.0.0',
        //historyApiFallback: true,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: 'index.html' },
                { from: /page\//, to: 'index.html' },
                { from: /welcome\//, to: 'index.html' },
                { from: /menu\//, to: 'index.html' },
            ],
        },
        hot: true,
        inline: true,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://mfts.local/',
            },
        },
        headers: {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            'Access-Control-Allow-Origin': '*',
        },
    },
});
