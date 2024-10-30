'use strict';

const sequelize = require('../config/db');
const User = require('./User')(sequelize);

module.exports = {
  sequelize,
  User
};
