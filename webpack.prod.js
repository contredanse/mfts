const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');
const BrotliPlugin = require('brotli-webpack-plugin');
const Workbox = require('workbox-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const Dotenv = require('dotenv');
const fs = require('fs');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

const extractSass = new MiniCssExtractPlugin({
    filename: 'static/css/style.[contenthash:8].css',
});

const dotEnvFile = fs.existsSync('.env.production.local') ? './.env.production.local' : './env/env-template';

Dotenv.config({
    path: dotEnvFile,
});

console.log('env', process.env);

const PUBLIC_URL = process.env.PUBLIC_URL;
const socialMediaPicture = process.env.SOCIAL_MEDIA_PICTURE;
const staticCompress = process.env.STATIC_COMPRESS === 'true' || process.env.STATIC_COMPRESS == '1';

const distFolder = path.resolve(__dirname, 'dist');

// Workbox worker is manually added to the static folder
const workboxMainJs = require.resolve('workbox-sw');
const workboxVersion = require(require.resolve('workbox-sw/package.json')).version;

const outdatedMainJs = require.resolve('outdated-browser-rework');
const outdatedVersion = require(require.resolve('outdated-browser-rework/package.json')).version;

const prodConfig = merge(common, {
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
            // Everyone will have a different babel 7 runtime, let's flatten it
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
            //'history': path.resolve(__dirname, 'node_modules/history'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: false,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: false,
                        },
                    },
                ],
            },
            {
                test: /\.woff$|\.woff2?$/,
                loader: 'file-loader',
                options: {
                    limit: 50000,
                    mimetype: 'application/font-woff',
                    name: 'static/fonts/[name].[ext]',
                },
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
                test: /\.(js|mjs)$/,
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                include: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    configFile: false,
                    compact: false,
                    presets: [[require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]],
                    cacheDirectory: true,
                    // If an error happens in a package, it's possible to be
                    // because it was compiled. Thus, we don't want the browser
                    // debugger to show the original code. Instead, the code
                    // being evaluated would be much more helpful.
                    sourceMaps: false,
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
                            //sourceMap: false,
                            //modules: false, // use CSS-Modules to scope styles
                            //importLoader: 2,
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
                            implementation: require('node-sass'),
                            sourceMap: false,
                            sassOptions: {},
                        },
                    },
                ],
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
                data: {
                    test: /[\\/]src\/data\/json\/(.*)\.json$/,
                    name: 'data',
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
                'react-friends': {
                    test: /[\\/]node_modules\/(redux|react-redux|connected-react-router|react-router|react-router-dom|formik|react-svg|react-transition-group|react-burger-menu|react-custom-scrollbars|react-is)\//,
                    name: 'react-friends',
                    priority: -10,
                    enforce: true,
                    chunks: 'all',
                },

                // Extract material-ui and icons in a separate chunk
                mui: {
                    test: /[\\/]node_modules\/(@material-ui|material-ui)/,
                    name: 'mui',
                    priority: -30,
                    enforce: true,
                    chunks: 'all',
                },
                vendors: {
                    // only js files need to be included
                    // from vendors
                    //test: /[\\/]node_modules[\\/](.*).js$/,
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -40,
                    enforce: true,
                    chunks: 'all',
                },
            },
        },

        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
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
        new CleanWebpackPlugin({}),

        new DotenvPlugin({
            path: dotEnvFile, // load this now instead of the ones in '.env'
            safe: false, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
            silent: false, // hide any errors
        }),

        new webpack.EnvironmentPlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            NODE_ENV: JSON.stringify('production'),
            OUTDATED_JS: `${distFolder}/public/static/js/outdated-browser-rework.${outdatedVersion}.js`,
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
            strict: false,
            exclude(instance) {
                // @material-ui/core and history
                // use different major versions for 'warning' package
                // That can be ignored.
                //return instance.name === 'warning';
                return ['warning', 'regenerator-runtime', 'history', 'scheduler'].includes(instance.name);
            },
        }),

        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            hash: false,
            template: './public/index.html',
            templateParameters: {
                socialMediaPicture: socialMediaPicture,
                publicUrl: PUBLIC_URL,
                title: "Steve Paxton's Material for the spine",
            },
            removeAttributeQuotes: true,
            removeComments: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
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

        new CopyWebpackPlugin({
            patterns: [
                // Copy default .htaccess file
                { from: './public/.htaccess.dist', to: `${distFolder}/public/.htaccess`, toType: 'file' },
                // Copy robots.txt
                { from: './public/robots.txt', to: `${distFolder}/public/robots.txt`, toType: 'file' },
                // Copy static .htaccess file for static assets
                { from: './public/static/.htaccess.dist', to: `${distFolder}/public/static/.htaccess`, toType: 'file' },
                { from: workboxMainJs, to: `${distFolder}/public/static/js/workbox-sw.${workboxVersion}.js` },
                {
                    from: outdatedMainJs,
                    to: `${distFolder}/public/static/js/outdated-browser-rework.${outdatedVersion}.js`,
                },
                { from: './src/assets/social/**/*', to: `${distFolder}/public/static/social/`, flatten: true },
            ],
        }),

        // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin

        new Workbox.GenerateSW({
            // Whether or not the service worker should start controlling any existing clients as soon as it activates.
            clientsClaim: true,
            // https://stackoverflow.com/questions/49482680/workbox-the-danger-of-self-skipwaiting
            skipWaiting: true,

            // Be sure to get our own local copy !
            importWorkboxFrom: 'disabled',
            importScripts: [`static/js/workbox-sw.${workboxVersion}.js`],

            // Exclude few things and
            exclude: [/\.htaccess$/, /assets-manifest\.json$/, /\.(?:map|br|gz)$/],
            navigateFallback: PUBLIC_URL + '/',
            navigateFallbackBlacklist: [
                // Exclude URLs starting with /_, as they're likely an API call
                new RegExp('^/_'),
                // Exclude URLs containing a dot, as they're likely a resource in
                // public/ and not a SPA route
                new RegExp('/[^/]+\\.[^/]+$'),
            ],
        }),

        new SitemapPlugin(
            PUBLIC_URL,
            [
                {
                    path: '/',
                    priority: '1.0',
                },
                {
                    path: '/en/menu',
                    hreflang: 'en',
                    priority: '0.8',
                },
                {
                    path: '/fr/menu',
                    hreflang: 'fr',
                    priority: '0.8',
                },
                {
                    path: '/en/intro',
                    hreflang: 'en',
                    priority: '0.8',
                },
                {
                    path: '/fr/intro',
                    hreflang: 'fr',
                    priority: '0.8',
                },
                {
                    path: '/en/page-list',
                    hreflang: 'en',
                    priority: '0.8',
                },
                {
                    path: '/fr/page-list',
                    hreflang: 'fr',
                    priority: '0.8',
                },
                {
                    path: '/en/about/about',
                    hreflang: 'en',
                    priority: '0.8',
                },
                {
                    path: '/fr/about/about',
                    hreflang: 'fr',
                    priority: '0.8',
                },
                {
                    path: '/en/about/bio',
                    hreflang: 'en',
                    priority: '0.6',
                },
                {
                    path: '/fr/about/biblio',
                    hreflang: 'fr',
                    priority: '0.6',
                },
                {
                    path: '/en/about/biblio',
                    hreflang: 'en',
                    priority: '0.6',
                },
                {
                    path: '/fr/about/credits',
                    hreflang: 'fr',
                    priority: '0.4',
                },
                {
                    path: '/en/about/credits',
                    hreflang: 'en',
                    priority: '0.4',
                },
            ],
            {
                fileName: 'sitemap.xml',
                lastMod: true,
                skipGzip: true,
                changeFreq: 'monthly',
                priority: '0.4',
            }
        ),

        new StatsWriterPlugin({
            // no support for absolute paths
            filename: '../.webpack-stats.json',
        }),
    ],
});

if (staticCompress === true) {
    prodConfig.plugins = [
        ...prodConfig.plugins,
        ...[
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
        ],
    ];
}

module.exports = prodConfig;
