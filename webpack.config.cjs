const path = require('path');

module.exports = {
  entry: './src/index.js',  // Entry point for your app
  output: {
    filename: 'bundle.js',  // The name of the output bundled file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Apply to all JavaScript files
        exclude: /node_modules/,  // Exclude node_modules
        use: {
          loader: 'babel-loader',  // Use babel-loader for transpiling JS
          options: {
            presets: ['@babel/preset-env'],  // Preset for modern JavaScript
          },
        },
      },
      {
        test: /\.css$/,  // Apply to all CSS files
        use: ['style-loader', 'css-loader'],  // Inject CSS into the DOM and bundle the CSS
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),  // Serve from the dist folder
    },
    open: true,  // Automatically open the browser
    port: 3000,  // Port for the dev server
  },
  mode: 'development',  // Set mode to development
};
