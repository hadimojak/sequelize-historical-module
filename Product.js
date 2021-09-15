const { DataTypes, sequelize,Model } = require('./sequelize');

class Product extends Model {

};
Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize: sequelize,
    modelName: "Product",
    tableName: 'products'
}
);
module.exports = Product;