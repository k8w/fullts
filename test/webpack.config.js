const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'index'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] },
            { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
            {
                test: /\.(png|jpe?g|gif)$/, use: [
                    'url-loader?limit=8192',
                    'img-loader'
                ]
            }, // 内联 base64 URLs, 限定 <=8k 的图片, 其他的用 URL
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ async: true, minChunks: 2 })
    ],
    devServer: {
        contentBase: __dirname,
        historyApiFallback: true,
        host: '0.0.0.0'
    },
    devtool: 'source-map'
}