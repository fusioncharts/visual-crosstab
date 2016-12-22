var webpack = require('webpack'),
    env = process.env.NODE_ENV || 'es6';
if (env === 'es6-min') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: './javascripts/',
            filename: 'crosstab-ext-es6.min.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['babili']
                    },
                    exclude: /node_modules/
                }, {
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
} else if (env === 'es6') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: './javascripts/',
            filename: 'crosstab-ext-es6.js'
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
} else if (env === 'es5') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: './javascripts/',
            filename: 'crosstab-ext-es5.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['latest']
                    },
                    exclude: /node_modules/
                }, {
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
} else if (env === 'es5-min') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: './javascripts/',
            filename: 'crosstab-ext-es5.min.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['latest']
                    },
                    exclude: /node_modules/
                }, {
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
        devtool: 'inline-source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    except: ['exports', 'require']
                }
            })
        ]
    };
} else if (env === 'es5-prod') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: './dist/',
            filename: 'crosstab-ext-es5.min.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['latest']
                    },
                    exclude: /node_modules/
                }, {
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
        devtool: 'inline-source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    except: ['exports', 'require']
                }
            })
        ]
    };
} else if (env === 'es6-prod') {
    module.exports = {
        entry: './src/index.js',
        output: {
            path: './dist/',
            filename: 'crosstab-ext-es6.min.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    query: {
                        presets: ['babili']
                    },
                    exclude: /node_modules/
                }, {
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
}
