const { DataTypes, sequelize,Model } = require('./sequelize');

class Product extends Model { };
Product.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    modelName: "Product"
}
);
Product.hasPaperTrail();

module.exports = Product;