const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    watch: true,
    watchOptions: {
        ignored: ['node_modules'],
        poll: 100
    },
    entry: ['./src/index.js', './src/styles/main.scss'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    optimization: {
        minimizer: [
            // new TerserPlugin({}),
            // new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            chunks: 'all',
            // cacheGroups: {
            //     styles: {
            //         name: 'main',
            //         test: /\.css$/,
            //         chunks: 'all',
            //         enforce: true,
            //     },
            // },
        }
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'css/main.css',
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    // },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader'
                    },
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: "src/index.html",

            }
        ),
        // new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            // filename: 'src/styles/main.scss',
        // }),
    ]
};
