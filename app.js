const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { sync } = require('./sync');
const User = require('./User');
const Product = require('./Product');




User.hasMany(Product);
Product.belongsTo(User);



User.create({ firstName: 'hadi', lastName: 'arbabi' }).then(() => {
    console.log('user created');
    Product.create({ title: 'car', price: 2000, UserId: 1 }).then(() => { console.log('product created'); });
});


sync();