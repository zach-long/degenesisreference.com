const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  // target: 'web',
  // externals: {
  //   react: 'react',
  //   'react-dom': 'react-dom'
  // },
  entry: './src/app.tsx',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../public/js'),
    // libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};