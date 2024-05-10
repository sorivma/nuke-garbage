const path = require("path")
const HTMLPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "bundle.[chunkhash].js",
        path: path.resolve(__dirname, "public")
    },
    devServer: {
        port: 3000,
        proxy: {
            '/buildings': 'http://localhost:8080',
            '/channel': 'http://localhost:8080',
            '/garbage': 'http://localhost:8080',
            '/roads': 'http://localhost:8080',
            '/static/index': 'http://localhost:8080',
            '/files/*': 'http://localhost:8080'
        },
    },
    plugins: [
        new HTMLPlugin({
            template: "./src/index.html"
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ],
    },
}