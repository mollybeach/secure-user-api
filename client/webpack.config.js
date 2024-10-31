require('dotenv').config({ path: '../.env' });

const REACT_APP_SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const REACT_APP_CLIENT_PORT = process.env.REACT_APP_CLIENT_PORT;

module.exports = {
  // ... other config ...
  devServer: {
    port: REACT_APP_CLIENT_PORT,
    proxy: {
      '/api': `http://localhost:${REACT_APP_SERVER_PORT}`,
      '/auth': `http://localhost:${REACT_APP_SERVER_PORT}`
    },
  },
  // ... rest of config ...
};
