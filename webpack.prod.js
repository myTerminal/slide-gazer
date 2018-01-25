/* global require module */

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = WebpackMerge(commonConfig, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin()
    ]
});
