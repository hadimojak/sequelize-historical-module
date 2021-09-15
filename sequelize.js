const { Sequelize, DataTypes, Model, } = require('sequelize');

const sequelize = new Sequelize('new', 'root', '2525', { host: 'localhost', dialect: 'mysql' });


module.exports = { sequelize, Sequelize, DataTypes, Model };



