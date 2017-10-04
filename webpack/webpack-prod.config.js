const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

let config = require("./webpack.config");

config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }
    )
);

config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        },
        IS_DEV_ENV: false
    })
);

config.plugins.push(
    new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessorOptions: {discardComments: {removeAll: true}}
        }
    )
)

config.plugins.push(
    new CleanWebpackPlugin([path.resolve(__dirname, '../src/build')], {
        root: process.cwd(), // without this ,it was throwing error ' directory is outside of the project root. Skipping...'
        verbose: true,
    })
);

module.exports = config;