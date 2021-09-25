const { Sequelize, DataTypes, Model } = require('sequelize');
const connection = { host: 'localhost', dialect: 'mysql' };

const sequelize = new Sequelize('new', 'root', '2525', connection
);



module.exports = { sequelize, Sequelize, DataTypes, Model };



