const path = require('path');

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
            '@config': path.resolve(__dirname, 'src/config/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@public': path.resolve(__dirname, 'public/'),
            '@assets': path.resolve(__dirname, 'src/assets/'),
            '@thirdparty': path.resolve(__dirname, 'src/thirdparty'),
            '@data': path.resolve(__dirname, 'src/data'),
            /**
             * Aliases to avoid duplicates in build.
             * i.e:
             *   'react-router': path.resolve(__dirname, 'node_modules/react-router'),
             */
            classnames: path.resolve(__dirname, 'node_modules/classnames'), // enabled: material-ui and local differs
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
            {
                test: /\.(mp4|m4v|ogv|webm)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/videos/[name].[ext]',
                },
            },
            {
                test: /\.(mp3)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/audios/[name].[ext]',
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

    plugins: [],
};
