const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
                test: /\.(s?css)$/,
                use: ['css-hot-loader', 'style-loader', 'css-loader', 'sass-loader'],
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
        /*
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
        */
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            hash: false,
            title: 'Paxton MFTS',
            template: './public/index.html',
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
        //historyApiFallback: true,
        historyApiFallback: {
            rewrites: [{ from: /^\/$/, to: 'index.html' }, { from: /page\//, to: 'index.html' }],
        },
        hot: true,
        inline: true,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://localhost:3000',
            },
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
});
