/* global require module */

const outputDir = 'public';

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');

const devConfig = require('./webpack.dev.js');

module.exports = WebpackMerge(devConfig, {
    devServer: {
        contentBase: './' + outputDir,
        historyApiFallback: true,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
