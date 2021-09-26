const { Sequelize, DataTypes, Model, } = require('sequelize');
const connection = { host: 'localhost', dialect: 'mysql' };

const sequelize = new Sequelize('new', 'root', '0015166031', connection
);


module.exports = { sequelize, Sequelize, DataTypes, Model };



