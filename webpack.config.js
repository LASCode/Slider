const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let entryPoints;
let plugins;

if (process.env.NODE_ENV === 'development') {
  entryPoints = {
    slider: './src/index.ts',
    demo: './src/demoPage/demoPage.ts',
  };
  plugins = [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: path.resolve(__dirname, 'src/demoPage/demoPage.html'),
      chunks: ['demo'],
    }),
  ];
}
if (process.env.NODE_ENV === 'production') {
  entryPoints = {
    slider: './src/index.ts',
  };
  plugins = [];
}
if (process.env.NODE_ENV === 'productionWithDemoPage') {
  entryPoints = {
    demo: './src/demoPage/demoPage.ts',
  };
  plugins = [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: path.resolve(__dirname, 'src/demoPage/demoPage.html'),
      chunks: ['demo'],
    }),
  ];
}

module.exports = {
  entry: entryPoints,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
    ],
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
};
