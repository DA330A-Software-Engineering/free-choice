const HtmlWebPackPlugin = require("html-webpack-plugin"); 
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/index.tsx'),
    output: {path: path.resolve(__dirname, './build'), filename: 'bundle.js'},
    resolve: { 
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            fs: false,
            'stream': require.resolve('stream-browserify'),
            'buffer': require.resolve('buffer/'),
            'util': require.resolve('util/'),
            'assert': require.resolve('assert/'),
            'http': require.resolve('stream-http/'),
            'url': require.resolve('url/'),
            'https': require.resolve('https-browserify/'),
            'os': require.resolve('os-browserify/'),
            'path': require.resolve('path-browserify')
          },
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline'
            }
        ],
    },
    plugins: [
        new Dotenv(),
        new HtmlWebPackPlugin({ 
            template: path.resolve(__dirname, './public/index.html')
        })
    ],
    devServer: {
        historyApiFallback: true
    },
};