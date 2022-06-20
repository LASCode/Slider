const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let entryPoints;
let plugins;

if (process.env.NODE_ENV === 'development') {
  entryPoints = {
    slider: './src/index.ts',
    demo: './src/demoPage/index.ts',
  };
  plugins = [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: path.resolve(__dirname, 'src/demoPage/index.pug'),
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
    demo: './src/demoPage/index.ts',
  };
  plugins = [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: path.resolve(__dirname, 'src/demoPage/index.pug'),
      chunks: ['demo'],
    }),
  ];
}

module.exports = {
  entry: entryPoints,
  output: {
    filename: '[name].js',
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
        use: [
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.pug$/,
        use: [{ loader: 'pug-loader', options: { pretty: true } }],
      },
    ],
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
};
