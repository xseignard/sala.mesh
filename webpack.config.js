const path = require("path")
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const extractCSS = new ExtractTextPlugin("assets/stylesheets/[name].bundle.dev.css")

let plugins = [ extractCSS,
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      inject: true
    })
]

if (process.env.NODE_ENV === "production") plugins.push(new UglifyJSPlugin())

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: ["./main.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "./",
    filename: "assets/scripts/[name].bundle.js"
  },
  module: {
    rules: [
      // Javascript files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      // HTML files or templates
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      // CSS files or stylesheets
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ["css-hot-loader"].concat(
          extractCSS.extract({
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1
                }
              },
            ]
          })
        )
      },
      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/images/[name].[ext]",
            }
          }
        ]
      },
      // Music
      {
        test: /\.(mp3|ogg|aac|flac)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/sounds/[name].[ext]",
            }
          }
        ]
      }
    ]
  },
  plugins,
  resolve: {
    extensions: [".js"]
  },
  devtool: process.env.NODE_ENV === "dev" ? "eval-source-map" : "",
  devServer: {
    port: process.env.PORT || 9000,
    host: "0.0.0.0",
    contentBase: "dist/"
  }
}
