module.exports = {
    entry: './src/index.js',
    output: {
        path: './public/javascripts/',
        filename: 'crosstab-ext.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ]
    },
    eslint: {
        configFile: './.eslintrc.json',
        failOnError: true
    },
    devtool: 'inline-source-map'
};
