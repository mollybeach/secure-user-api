//const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config({ path: '../.env' });

const SERVER_PORT = process.env.SERVER_PORT || 3000;

module.exports = {
  // ... other config ...
  devServer: {
    port: 3001,
    proxy: {
      '/api': `http://localhost:${SERVER_PORT}`,
      '/auth': `http://localhost:${SERVER_PORT}`
    },
  },
  // ... rest of config ...
};
