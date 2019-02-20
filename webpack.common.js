const path = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const marked = require('marked');
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace('<a', "<a target='_blank' ");
};

module.exports = {
    entry: {
        // Polyfill needed only in production
        // index: ['babel-polyfill', './src/js/index.tsx'],
        index: ['./src/js/index.tsx'],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss', '.md'],
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
        },
    },
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
                            plugins: ['react-hot-loader/babel'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            // IMPORTANT! use transpileOnly mode to speed-up compilation
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                // Whenever babel is ready to fully handle typescript
                // you can use the following rule
                //test: /\.[tj]sx?$/,
                test: /\.(jsx|js|mjs)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            plugins: ['react-hot-loader/babel'],
                        },
                    },
                ],
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                    {
                        loader: 'markdown-loader',
                        options: {
                            /* your options here */
                            renderer,
                        },
                    },
                ],
            },
            {
                test: /\.mdx$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'mdx-loader',
                        options: {
                            //mdPlugins: [images]
                        },
                    },
                ],
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' },
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
                test: /\.ico$/,
                loader: 'file-loader?',
                options: {
                    name: '[name].[ext]', // <-- retain original file name
                },
            },
        ],
    },

    plugins: [new ForkTsCheckerWebpackPlugin()],
};
