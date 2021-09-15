const { DataTypes, sequelize,Model } = require('./sequelize');


class User extends Model {

};
User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,

    }, lastName: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        sequelize: sequelize,
        modelName: "User",
        tableName: 'users'
    }
);
module.exports = User;
