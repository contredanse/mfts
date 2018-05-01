const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        // 'babel-polyfill',
        index: ['./src/js/index.tsx'],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss'],
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            /**
             * Internal import aliases for convenience.
             */
            '@src': path.resolve(__dirname, 'src/js/'),
            '@data': path.resolve(__dirname, 'src/js/data'),
            '@config': path.resolve(__dirname, 'src/config/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@public': path.resolve(__dirname, 'public/'),
            '@assets': path.resolve(__dirname, 'src/assets/'),
            '@shaders': path.resolve(__dirname, 'src/shaders'),
            '@thirdparty': path.resolve(__dirname, 'src/thirdparty'),
            '@db': path.resolve(__dirname, 'src/db'),
            /**
             * Aliases to avoid duplicates in build.
             * - react-router alias can be probably removed when react-router-redux
             *   is upgrade to a later version than alpha.9.
             */
            'react-router': path.resolve(__dirname, 'node_modules/react-router'),
            recompose: path.resolve(__dirname, 'node_modules/recompose'),
        },
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
                            useBabel: false,
                            useCache: true,
                            silent: true,
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            /*
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'ts-shader-loader',
            },*/
            {
                test: /\.(mp4|m4v|ogv|webm)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/videos/[name].[ext]',
                },
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
                test: /\.ico$/,
                loader: 'file-loader?',
                options: {
                    name: '[name].[ext]', // <-- retain original file name
                },
            },
        ],
    },

    plugins: [
        /*
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),*/
    ],
};
