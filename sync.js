const { sequelize } = require('./sequelize');

const sync = async () => { await sequelize.sync({alter: true }); };

module.exports = { sync };