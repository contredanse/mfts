const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractSass = new MiniCssExtractPlugin({
    filename: "style.css",
});

module.exports = merge(common, {
    devtool: 'cheap-module-source-map',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        // for webpack-dev-server only !
        publicPath: '/public/build/'
    },
    //context: path.resolve(__dirname),
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        extractSass
        /*
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
        */
    ],
    optimization: {
        namedModules: true, // NamedModulesPlugin()
    },
    devServer: {
        contentBase: path.resolve(__dirname, "build"),
        port: 3001,
        //historyApiFallback: true,
        historyApiFallback: {
            rewrites: [
                {from: /^\/$/, to: 'index.html'},
                {from: /page\//, to: 'index.html'}
            ]
        },
        hot: true,
        inline: true,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://localhost:3000'
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    }
});
