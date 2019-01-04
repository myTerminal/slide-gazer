/* global require module */

const sourceDir = 'src/client';

const configs = require('./configs.json');

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const copy = new CopyWebpackPlugin([
    {
        from: sourceDir + '/sw.js',
        transform: function (content, path) {
            return content.toString()
                .replace(/#sw-cache-string#/g, (new Date().getTime()))
                .replace(/#sw-origin#/g, configs.origin);
        }
    }
]);
const html = new HtmlWebpackPlugin({
    template: sourceDir + '/index.ejs',
    templateParameters: {
        titlePrefix: ''
    },
    filename: 'index.html',
    chunks: ['app'],
    hash: true
});

module.exports = WebpackMerge(commonConfig, {
    mode: 'production',
    plugins: [
        copy,
        new UglifyJSPlugin(),
        html
    ]
});
