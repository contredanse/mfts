const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');
const BrotliPlugin = require('brotli-webpack-plugin');
const Workbox = require('workbox-webpack-plugin');

const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

// Don't forget: no ending slashes - it's used in registerServiceWorker.ts too
const PUBLIC_URL = 'https://preview.materialforthespine.com';

const extractSass = new MiniCssExtractPlugin({
    filename: 'static/css/style.[contenthash:8].css',
});

const distFolder = path.resolve(__dirname, 'dist');

// Workbox worker is manually added to the static folder
const workboxMainJs = require.resolve('workbox-sw');
const workboxVersion = require(require.resolve('workbox-sw/package.json')).version;

module.exports = merge(common, {
    devtool: 'hidden-source-map', // or false if you don't want source map
    mode: 'production',
    entry: ['./src/js/index.tsx'],
    output: {
        path: path.resolve(distFolder, 'public'),
        filename: 'static/js/[name].[chunkhash:8].bundle.js',
        chunkFilename: 'static/js/[name].[chunkhash:8].bundle.js',
        publicPath: '/',
    },
    resolve: {
        alias: {
            /**
             * Aliases to avoid duplicates in build.
             */
            classnames: path.resolve(__dirname, 'node_modules/classnames'), // enabled: material-ui and local differs
            // Material-ui & material-ui-icons
            recompose: path.resolve(__dirname, 'node_modules/recompose'),
            // React-transition-group
            'react-transition-group': path.resolve(__dirname, 'node_modules/react-transition-group'),
            'hoist-non-react-statics': path.resolve(__dirname, 'node_modules/hoist-non-react-statics'),

            // Everyone will have a different babel 7 runtime, let's flatten it
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
        },
    },
    module: {
        rules: [
            {
                test: /\.woff$|\.woff2?$/,
                loader: 'file-loader',
                options: {
                    limit: 50000,
                    mimetype: 'application/font-woff',
                    name: 'static/fonts/[name].[ext]',
                },
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'static/images',
                        },
                    },
                ],
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
            /*
            {
                include: path.resolve('node_modules', 'react-i18next'),
                sideEffects: false,
            }*/
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

                i18next: {
                    test: /[\\/]node_modules\/(.*)i18n/,
                    name: 'i18next',
                    priority: -2,
                    enforce: true,
                    chunks: 'all',
                },

                react: {
                    test: /[\\/]node_modules\/(react|react-dom)\//,
                    name: 'react',
                    priority: -5,
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
        //concatenateModules: true, //ModuleConcatenationPlugin (scope-hoisting)
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,

                        dead_code: true,
                        drop_debugger: true,

                        // Allow console messages
                        drop_console: false,

                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending futher investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: true,
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
                return ['warning'].includes(instance.name);
            },
        }),

        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            hash: false,
            title: "Steve Paxton's Material for the spine",
            template: './public/index.html',
            removeAttributeQuotes: true,
            removeComments: true,
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
            },
        }),

        new WebpackPwaManifest({
            short_name: 'Paxton MFS',
            name: 'Paxton - Material for the spine',
            description: "Steve Paxton's Material for the spine - An application by contredanse.org ",
            background_color: '#000000',
            theme_color: '#000000',
            start_url: '/?utm_source=homescreen',
            inject: true,
            fingerprints: true,
            ios: {
                'apple-mobile-web-app-title': 'Paxton MFS',
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
                    size: 512,
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

        new HtmlWebpackHarddiskPlugin(),

        new CopyWebpackPlugin([
            // Copy default .htaccess file
            { from: './public/.htaccess.dist', to: `${distFolder}/public/.htaccess`, toType: 'file' },
            // Copy static .htaccess file for static assets
            { from: './public/static/.htaccess.dist', to: `${distFolder}/public/static/.htaccess`, toType: 'file' },
            { from: workboxMainJs, to: `${distFolder}/public/static/js/workbox-sw.${workboxVersion}.js` },
        ]),

        new CompressionPlugin({
            test: /\.(js|css|svg)$/,
            compressionOptions: {
                numiterations: 15,
            },
            algorithm(input, compressionOptions, callback) {
                return zopfli.gzip(input, compressionOptions, callback);
            },
        }),

        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|svg)$/,
        }),

        // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin

        new Workbox.GenerateSW({
            // Whether or not the service worker should start controlling any existing clients as soon as it activates.
            //clientsClaim: true,
            // https://stackoverflow.com/questions/49482680/workbox-the-danger-of-self-skipwaiting
            //skipWaiting: true,

            // Be sure to get our own local copy !
            importWorkboxFrom: 'disabled',
            importScripts: [`static/js/workbox-sw.${workboxVersion}.js`],

            // Exclude few things and
            exclude: [/\.htaccess$/, /assets-manifest\.json$/, /\.(?:map|br|gz)$/],
            navigateFallback: PUBLIC_URL + '/index.html',
            navigateFallbackBlacklist: [
                // Exclude URLs starting with /_, as they're likely an API call
                new RegExp('^/_'),
                // Exclude URLs containing a dot, as they're likely a resource in
                // public/ and not a SPA route
                new RegExp('/[^/]+\\.[^/]+$'),
            ],
        }),

        //new Workbox.InjectManifest({
        // It's actually a chunk name !!!
        //importWorkboxFrom: 'workboxSw',
        //    importWorkboxFrom: 'disabled',
        //    importScripts: [`static/js/workbox-sw.${workboxVersion}.js`],
        //    swSrc: './src/js/service-worker.webpack.stub.js',
        //    swDest: 'service-worker.js',
        //    exclude: [/\.htaccess$/, /assets-manifest\.json$/, /\.map$/, /\.br$/, /\.gz$/],

        /** Only working with GeneratSwPlugin
            navigateFallback: 'index.html',
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            navigateFallbackWhitelist: [/^(?!\/__).*<REMOVEMEWHENUNCOMMENTING>/ ],
            // Whether or not the service worker should start controlling any existing clients as soon as it activates.
            clientsClaim: true,
            // Whether or not the service worker should skip over the waiting lifecycle stage. Normally this is used with `clientsClaim: true`.
            skipWaiting: true
            */
        //}),

        new StatsWriterPlugin({
            // no support for absolute paths
            filename: '../.webpack-stats.json',
        }),
    ],
});
