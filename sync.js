const { sequelize } = require('./sequelize');

const sync = async () => { await sequelize.sync({ alter: true }); };

const authentiacete = async () => { await sequelize.authenticate(); };

module.exports = { sync, authentiacete };