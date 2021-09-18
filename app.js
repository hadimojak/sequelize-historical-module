const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { sync } = require('./sync');
const Temporal = require('sequelize-temporal');



class User extends Model { };
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
        modelName: "User", paranoid: true,
    }
);

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
    modelName: "Product", paranoid: true,
}
);

Temporal(User, sequelize, { blocking: true, full: true });
Temporal(Product, sequelize, { blocking: true, full: true });



User.hasMany(Product);
Product.belongsTo(User);

const undo = async () => {
    let lastHis = await sequelize.query(`SELECT id,
firstName,
lastName,
createdAt,
updatedAt,
deletedAt
FROM userhistories
where id = 1
order by hid desc
limit 1;`);
    lastHis = lastHis[0][0];
    console.log(lastHis);
    // await User.create({ firstName: lastHis.firstName, lastName: lastHis.lastName, id: lastHis.id });
    await sequelize.query(`UPDATE users
    SET deletedAt = null
    WHERE id = 1;`);
};


undo();




// User.create({ firstName: 'hadi', lastName: 'aasd' }).then(() => {
//     console.log('user created');
//     Product.create({ title: 'ccc', price: 2000, UserId: 1 }).then(() => { console.log('product created'); });
// });

// User.update({ lastName: 'mojak' }, { where: { id: 1 } }).then(() => { console.log('product updated'); });
// User.destroy({ where: { id: 1 } }).then(() => { console.log('product removed'); });
// Product.destroy({ where: { id: 1 } }).then(() => { console.log('product updated'); });



sync();