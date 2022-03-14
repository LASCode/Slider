const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      {ProvidePlugin} = require('webpack'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          "ts-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: { sourceMap: true }},
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: "css-loader", options: { sourceMap: true }},
          {loader: "sass-loader", options: { sourceMap: true }}
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new ProvidePlugin({
      $:'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}