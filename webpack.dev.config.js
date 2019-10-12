const PATH = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        'main':'./src2/index.js'
    },
    output: {
        path: PATH.resolve('./build'),
        filename: "index.js"
    },
    devServer: {
        contentBase: PATH.join(__dirname, "build"),
        compress: false,
        openPage:'demo.html',
        open: true,
        hot: true,
        port: 9000
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader'
        },{
            // 图片加载器
            test:/\.(png|jpg|gif|jpeg)$/,
            use:[{
                loader:'url-loader',
                options:{
                    limit:1000
                }
            }]
        },
        {
            test: /\.html$/,
            loader: 'html-withimg-loader'
        }
    ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src2/view/index.html',
            filename:'demo.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: false,
            cache: true,
            showErrors: true,
            chunks: 'all',


        })
    ]
}