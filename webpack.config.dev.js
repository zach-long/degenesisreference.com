const path = require('path');

const outputDir = `./public`;
const sourceJs = `./src/items.tsx`;
const outputJsName = `items.js`;

module.exports = {
  mode: 'development',
  entry: sourceJs,
  output: {
    filename: outputJsName,
    path: path.resolve(__dirname, outputDir)
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};