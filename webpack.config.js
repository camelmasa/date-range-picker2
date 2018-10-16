const HtmlWebPackPlugin = require("html-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  output: {
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                  plugins: [
                    require('postcss-import')(),
                    require('postcss-nesting')(),
                    require('postcss-simple-vars')(),
                    require('postcss-flexbugs-fixes')(),
                    require('autoprefixer')()
                  ]
              }
          }
        ]
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: "svg-react-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      react: "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new BundleAnalyzerPlugin()
  ]
}
