/* eslint-disable no-undef */
const path = require("path");
const HTMLWebpackPLugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

const isDev = (process.env.NODE_ENV = "development");
const isProd = !isDev;

const filename = (ext) => {
    if (isDev) {
        return `[name].${ext}`;
    }
    return `[name].[hash].${ext}`;
};

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };
    if (isProd) {
        (config.minimize = true),
            (config.minimizer = [
                new OptimizeCssAssetsWebpackPlugin(),
                new TerserWebpackPlugin({
                    cache: true,
                    parallel: true,
                }),
                new UglifyJsPlugin({
                    parallel: true,
                    uglifyOptions: {
                        output: {
                            beautify: false,
                        },
                    },
                }),
                new CssMinimizerPlugin(),
            ]);
    }
    return config;
};

const plugins = () => {
    const base = [
        new HTMLWebpackPLugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd, // для минификации html
            },
        }), // для работы с html
        new CleanWebpackPlugin(), // для очистки старых сгенерированных файлов в dist
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/static/images"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            // для того чтобы файлы css хранились не в html файле, а в отдельном файле
            filename: filename("css"),
        }),
        new CompressionPlugin(),
    ];
    if (isProd) {
        base.push(new BundleAnalyzerPlugin());
    }
    return base;
};

const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: "",
            },
        },
        "css-loader",
    ];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: isDev ? "development" : "production",
    cache: {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, ".temp_cache"),
    },
    entry: {
        main: [
            "webpack-dev-server/client?http://localhost:9000/",
            "@babel/polyfill",
            "./index.tsx",
        ],
    },
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    optimization: optimization(),
    devServer: {
        compress: true,
        port: 9000,
        historyApiFallback: true,
        hot: true,
        watchContentBase: true,
    },
    devtool: isDev ? "cheap-module-source-map" : false,
    plugins: plugins(),
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders(),
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"],
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"],
            },
            {
                test: /\.p?css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: {
                                    "postcss-import": {}, // This plugin should probably be used as the first plugin of your list
                                    "postcss-mixins": {}, // Note, that you must set this plugin before postcss-simple-vars and postcss-nested
                                    "postcss-calc": {},
                                    "postcss-custom-media": {},
                                    "postcss-custom-properties": {},
                                    "postcss-nested": {},
                                    "postcss-url": { url: "rebase" },
                                    autoprefixer: {}, // use ../.browserslistrc
                                },
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: { cacheDirectory: true },
                },
            },
        ],
    },
};
