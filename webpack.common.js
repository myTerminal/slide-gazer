/* global require module __dirname */

const sourceDir = 'src/client';
const outputDir = 'public';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const clean = new CleanWebpackPlugin([outputDir]);
const copy = new CopyWebpackPlugin([
    {
        from: `${sourceDir}/favicon.ico`
    },
    {
        from: `${sourceDir}/icons`,
        to: 'icons'
    }
]);
const extractCSS = new ExtractTextPlugin('styles/styles.css');
const optimizeCSS = new OptimizeCssAssetsPlugin();

module.exports = {
    mode: 'development',
    entry: {
        app: `./${sourceDir}/scripts/index.jsx`
    },
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        publicPath: '../'
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        publicPath: '../'
                    }
                }
            },
            {
                test: /\.(less|css)$/,
                use: ['extracted-loader'].concat(extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                }))
            },
            {
                test: /\.(jsx|js)$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        clean,
        copy,
        extractCSS,
        optimizeCSS
    ],
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, outputDir),
        publicPath: ''
    }
};
