require('dotenv').config({ path: '../.env' });

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const CLIENT_PORT = process.env.CLIENT_PORT || 3001;

module.exports = {
  // ... other config ...
  devServer: {
    port: CLIENT_PORT,
    proxy: {
      '/api': `http://localhost:${SERVER_PORT}`,
      '/auth': `http://localhost:${SERVER_PORT}`
    },
  },
  // ... rest of config ...
};
