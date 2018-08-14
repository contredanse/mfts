const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

// Don't forget: no ending slashes - it's used in registerServiceWorker.ts too
const PUBLIC_URL = 'https://preview.materialforthespine.com';

const extractSass = new MiniCssExtractPlugin({
    filename: 'static/css/style.[contenthash:8].css',
});

module.exports = merge(common, {
    devtool: 'hidden-source-map', // or false if you don't want source map
    mode: 'production',
    entry: [
        // 'babel-polyfill',
        './src/js/index.tsx',
    ],

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name].[chunkhash:8].bundle.js',
        chunkFilename: 'static/js/[name].[chunkhash:8].bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.woff$|\.woff2?$/,
                loader: 'file-loader',
                //use: 'url-loader?limit=10000',
                options: {
                    limit: 50000,
                    mimetype: 'application/font-woff',
                    name: 'static/fonts/[name].[ext]',
                },
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            sourceMap: false,
                            modules: false, // use CSS-Modules to scope styles
                            importLoader: 2,
                        },
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            config: {
                                path: path.resolve(__dirname, 'postcss.config.js'),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader', // compiles Sass to CSS
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: false,
                            sourceMapContents: false,
                        },
                    },
                ],
            },
            /**
             * To help tree-shaking and save a few kb's...
             * we can force declaration of sideEffects directly in the webpack
             * rules section. Use with care, most libraries will update the
             * sideEffect declaration in package.json anyway
             */
            {
                include: path.resolve('node_modules', 'react-router'),
                sideEffects: false,
            },
            {
                include: path.resolve('node_modules', 'react-router-dom'),
                sideEffects: false,
            },
        ],
    },

    optimization: {
        //namedModules: true, // NamedModulesPlugin(), will increase size
        //runtimeChunk: 'single',

        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,

            cacheGroups: {
                /* Not required
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'initial',
                    //enforce: true,
                    priority: -30,
                    minSize: 0,
                    reuseExistingChunk: true,
                },*/
                data: {
                    test: /[\\/]src\/data\/json\/(.*)\.json$/,
                    name: 'data',
                    enforce: true,
                    chunks: 'all',
                },
                // Extract material-ui and icons in a separate chunk
                mui: {
                    test: /[\\/]node_modules\/(@material-ui|material-ui)/,
                    name: 'mui',
                    priority: -10,
                    enforce: true,
                    chunks: 'all',
                },
                vendors: {
                    // only js files need to be included
                    // from vendors
                    //test: /[\\/]node_modules[\\/](.*).js$/,
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -20,
                    enforce: true,
                    chunks: 'all',
                },
            },
        },

        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        concatenateModules: true, //ModuleConcatenationPlugin (scope-hoisting)

        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                    compress: {
                        dead_code: true,
                        drop_debugger: true,
                        drop_console: true,
                    },
                },
            }),

            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    //map: { inline: false, },
                    //safe: true,
                    discardUnused: {
                        fontFace: false, // to not remove additional @font-face
                    },
                    discardComments: {
                        removeAll: true,
                    },
                },
                canPrint: true,
            }),
        ],
    },

    plugins: [
        new CleanWebpackPlugin('dist', {}),

        new webpack.EnvironmentPlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            NODE_ENV: JSON.stringify('production'),
            // Don't forget: no ending slashes - it's used in registerServiceWorker.ts too
            PUBLIC_URL: PUBLIC_URL,
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),

        extractSass,

        new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: true,
            // Warn also if major versions differ (default: true)
            strict: true,
            exclude(instance) {
                // @material-ui/core and history
                // use different major versions for 'warning' package
                // That can be ignored.
                //return instance.name === 'warning';
                ['warning', '@babel/runtime'].includes(instance.name);
            },
        }),

        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            hash: false,
            title: 'Paxton MFTS',
            template: './public/index.html',
            removeAttributeQuotes: true,
            removeComments: true,
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
            },
        }),

        new WebpackPwaManifest({
            short_name: 'Paxton MFTS',
            name: 'Steve Paxton - Material for the spine',
            description: 'Material for the spine. Contredanse.org ',
            background_color: '#000000',
            theme_color: '#000000',
            start_url: '/?utm_source=homescreen',
            inject: true,
            fingerprints: true,
            ios: {
                'apple-mobile-web-app-title': 'Paxton MFTS',
                'apple-mobile-web-app-capable': 'yes',
                'apple-mobile-web-app-status-bar-style': 'black',
            },
            orientation: 'any',
            display: 'standalone',
            icons: [
                {
                    src: path.resolve('src/assets/icons/logo.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join('static', 'icons'),
                },
                {
                    src: path.resolve('src/assets/icons/logo.png'),
                    sizes: [120, 152, 167, 180],
                    destination: path.join('static', 'icons', 'ios'),
                    ios: true,
                },
                {
                    src: path.resolve('src/assets/icons/logo.png'),
                    size: 1024,
                    destination: path.join('static', 'icons', 'ios'),
                    ios: 'startup',
                },
            ],
        }),

        new ManifestPlugin({
            fileName: 'assets-manifest.json',
            basePath: '',
            hash: true,
        }),

        new SWPrecacheWebpackPlugin({
            cacheId: 'paxton-material-for-the-spine',
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
                if (message.indexOf('Total precache size is') === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return;
                }
                if (message.indexOf('Skipping static resource') === 0) {
                    // This message obscures real errors so we ignore it.
                    // https://github.com/facebookincubator/create-react-app/issues/2612
                    return;
                }
                console.log(message);
            },
            minify: false,
            // For unknown URLs, fallback to the index page
            navigateFallback: PUBLIC_URL + '/',
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            //staticFileGlobsIgnorePatterns: [/\.map$/, /assets-manifest\.json$/, /index\.html/, /\.br$/, /\.gz$/],
            staticFileGlobsIgnorePatterns: [/\.map$/, /assets-manifest\.json$/, /\.br$/, /\.gz$/],
        }),

        new HtmlWebpackHarddiskPlugin(),

        /* Disabled because no usage now (can be enabled for nginx with brotli static)
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        */

        new CompressionPlugin({
            test: /\.(js|css|svg)$/,
        }),

        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|svg)$/,
        }),

        /*
        new StatsWriterPlugin({
            filename: '.webpack-stats.json'
        }),*/
    ],
});
