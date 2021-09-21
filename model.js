const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');


class User extends Model { };
User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
},
    {
        sequelize: sequelize,
        modelName: "user", paranoid: true
    }
);

class UserHistory extends Model { };
UserHistory.init({
    user_id: { type: DataTypes.INTEGER },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ip: { type: DataTypes.STRING },
    opration: { type: DataTypes.STRING },
    platform: { type: DataTypes.STRING },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
    },
    restoredAt: {
        type: Sequelize.DATE,
        defaultValue: null
    }
}, {
    sequelize: sequelize, timestamps: false,
    modelName: "userHistory"
});

class Product extends Model { };
Product.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }, price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, store: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {
    sequelize: sequelize,
    modelName: "product", paranoid: true
}
);

class ProductHistory extends Model { };
ProductHistory.init({
    product_id: { type: DataTypes.INTEGER },
    title: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.INTEGER,
    }, store: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ip: { type: DataTypes.STRING },
    opration: { type: DataTypes.STRING },
    platform: { type: DataTypes.STRING },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
    },
    restoredAt: {
        type: Sequelize.DATE,
        defaultValue: null
    }
}, {
    sequelize: sequelize, timestamps: false,
    modelName: "productHistory"
});

User.hasMany(Product);
Product.belongsTo(User);

module.exports = { User, Product, UserHistory, ProductHistory };