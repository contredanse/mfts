module.exports = {
    plugins: [
        /*
         * Adds vendor prefixes to css attributes
         * https://github.com/postcss/autoprefixer
         */
        require('autoprefixer')({
            /* It should add vendor prefixes for the last 2 versions of all browsers, meaning old prefixes such as
             * -webkit-border-radius: 5px; that the latest browsers support as border-radius won't be added.
             * https://github.com/ai/browserslist#queries
             */
            browsers: 'last 2 versions',
        }),
    ],
};
