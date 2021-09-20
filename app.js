const epxress = require('express');
const app = epxress();
const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { sync } = require('./sync');
const { Product, User, UserHistory } = require('./model');
const hooks = require('./hooks');



app.get('/', (req, res, next) => {
    new hooks.UserHook(req);
    new hooks.ProductHook(req);

    async function create() {
        User.create({ firstName: 'hadi', lastName: 'arbabi' }).then(() => {
            console.log('user created');
            Product.create({ title: 'ccc', price: 2000, userId: 1 }).then(() => { console.log('product created'); });
        });
    };
    // create();

    // async function update() {
    //     User.update({ lastName: 'gooooozzz ' }, { where: { id: 1 }, individualHooks: true }).
    //         then(() => { console.log('user updated'); }).
    //         catch(err => { console.log(err); });
    // }
    // update();

    // async function update() {
    //     Product.update({ title: 'harchi ' }, { where: { id: 1 }, individualHooks: true }).
    //         then(() => { console.log('product updated'); }).
    //         catch(err => { console.log(err); });
    // }
    // update();

    // async function destroy() {
    //     Product.destroy({ where: { id: 1 }, individualHooks: true }).
    //         then(() => { console.log('product destroyed'); }).
    //         catch(err => { console.log(err); });
    // }
    // destroy();

    // async function destroy() {
    //     User.destroy({ where: { id: 1 }, individualHooks: true }).
    //         then(() => { console.log('user destroyed'); }).
    //         catch(err => { console.log(err); });
    // }
    // destroy();

    async function undo(id) {
        await sequelize.query(`UPDATE users
        SET deletedAt = null
        WHERE id = ${id};`);
        // await User.update({ deletedAt: null  }, { where: { id: id } });
        console.log('user restored');
    };
    undo(1);

    // async function undo(id) {
    //     await sequelize.query(`UPDATE products
    //     SET deletedAt = null
    //     WHERE id = ${id};`);
    //     // await User.update({ deletedAt: null  }, { where: { id: id } });
    //     console.log('product restored');
    // };
    // undo(1);

    res.json('userIp');
});



sync().then((async data => {
    try {
        await app.listen(3000);
        console.log('db connected & server runs');
    } catch (error) {
        throw new Error(error);
    }

}));;




