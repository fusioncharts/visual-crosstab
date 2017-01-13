var webpack = require('webpack'),
    BabiliPlugin = require('babili-webpack-plugin'),
    env = process.env.NODE_ENV || 'es6',
    webpackConfigObj = {
        entry: './src/crosstabExt.js',
        output: {
            library: ['CrosstabExt'],
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    eslint: {
                        configFile: './.eslintrc.json',
                        failOnError: true
                    }
                }
            })
        ]
    };
if (env === 'es6-min') {
    webpackConfigObj.output.path = './javascripts/vendor/crosstab/';
    webpackConfigObj.output.filename = 'crosstab-ext-es6.min.js';
    webpackConfigObj.plugins.push(new BabiliPlugin());
    webpackConfigObj.devtool = 'source-map';
} else if (env === 'es6') {
    webpackConfigObj.output.path = './javascripts/vendor/crosstab/';
    webpackConfigObj.output.filename = 'crosstab-ext-es6.js';
} else if (env === 'es6-prod') {
    webpackConfigObj.output.path = './dist/';
    webpackConfigObj.output.filename = 'crosstab-ext-es6.min.js';
    webpackConfigObj.plugins.push(new BabiliPlugin());
    webpackConfigObj.devtool = 'source-map';
} else if (env === 'es5-min') {
    webpackConfigObj.output.path = './javascripts/vendor/crosstab/';
    webpackConfigObj.output.filename = 'crosstab-ext-es5.min.js';
    webpackConfigObj.module.rules.unshift({
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
            presets: ['latest']
        },
        exclude: /node_modules/
    });
    webpackConfigObj.devtool = 'source-map';
    webpackConfigObj.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['exports', 'require']
        }
    }));
} else if (env === 'es5') {
    webpackConfigObj.output.path = './javascripts/vendor/crosstab/';
    webpackConfigObj.output.filename = 'crosstab-ext-es5.js';
    webpackConfigObj.module.rules.unshift({
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
            presets: ['latest']
        },
        exclude: /node_modules/
    });
    webpackConfigObj.devtool = 'source-map';
} else if (env === 'es5-prod') {
    webpackConfigObj.output.path = './dist/';
    webpackConfigObj.output.filename = 'crosstab-ext-es5.min.js';
    webpackConfigObj.module.rules.unshift({
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
            presets: ['latest']
        },
        exclude: /node_modules/
    });
    webpackConfigObj.devtool = 'source-map';
    webpackConfigObj.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['exports', 'require']
        }
    }));
}

module.exports = webpackConfigObj;
