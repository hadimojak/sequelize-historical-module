const epxress = require('express');
const app = epxress();
const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { sync } = require('./sync');
const { Product, User, UserHistory, ProductHistory } = require('./model');
const hooks = require('./hooks');


app.get('/', (req, res, next) => {
    new hooks(req, User, UserHistory).throwHook();
    new hooks(req, Product, ProductHistory).throwHook();

    // async function create() {
    //     User.bulkCreate([
    //         { firstName: 'hadi', lastName: 'arbabi' },
    //         { firstName: 'ahmad', lastName: 'asadi' },
    //         { firstName: 'ali', lastName: 'mashali' },]).then(() => {
    //             console.log('user created');
    //             Product.bulkCreate([
    //                 { title: 'apple', price: 610, store: 5, userId: 1 },
    //                 { title: 'car', price: 25000, store: 1, userId: 2 },
    //                 { title: 'bike', price: 3000, store: 1, userId: 2 },
    //                 { title: 'blackboard', price: 300, store: 1, userId: 3 },
    //                 { title: 'chair', price: 1633, store: 1, userId: 1 },]);
    //         });
    // };
    // create();

    async function update1() {
        User.update({ firstName: "hadi", lastName: 'arbabi', }, { where: { id: 1 }, individualHooks: true }).
            then(() => { console.log('user updated'); }).
            catch(err => { console.log(err); });
    }
    update1();

    // async function update() {
    //     Product.update({ title: 'box ' }, { where: { id: 2 }, individualHooks: true }).
    //         then(() => { console.log('product updated'); }).
    //         catch(err => { console.log(err); });
    // }
    // update();

    // async function destroy1() {
    //     Product.destroy({ where: { id: 2 }, individualHooks: true }).
    //         then(() => { console.log('product destroyed'); }).
    //         catch(err => { console.log(err); });
    // }
    // destroy1();

    // async function destroy() {
    //     User.destroy({ where: { id: 2 }, individualHooks: true }).
    //         then(() => { console.log('user destroyed'); }).
    //         catch(err => { console.log(err); });
    // }
    // destroy();

    // async function undoDeletedUser(id) {
    //     req.undo = true;
    //     const user = await User.findByPk(id, { paranoid: false });
    //     await user.restore();
    // };
    // undoDeletedUser(2);

    // async function undoDeletedProduct(id) {
    //     req.undo = true;
    //     const product = await Product.findByPk(id, { paranoid: false });
    //     await product.restore();
    // };
    // undoDeletedProduct(1);

    // async function undoUpdatedUser(id, historyId) {
    //     req.undo = true;
    //     const arrayHistory = await UserHistory.
    //         findAll({ where: { user_id: id, opration: 'update' }, order: [['id', 'ASC']] });
    //     const userHistory = arrayHistory[historyId].dataValues;
    //     console.log(userHistory);
    //     await User.update({
    //         firstName: userHistory.firstName,
    //         lastName: userHistory.lastName,
    //     }, { where: { id: userHistory.user_id }, individualHooks: true });
    // };
    // undoUpdatedUser(2, 0);

    // async function undoUpdatedProduct(id, historyId) {
    //     req.undo = true;
    //     const arrayHistory = await ProductHistory.
    //         findAll({ where: { product_id: id, opration: 'update' }, order: [['id', 'ASC']] });
    //     const productHistory = arrayHistory[historyId].dataValues;
    //     console.log(productHistory);
    //     await Product.update({
    //         title: productHistory.title,
    //         price: productHistory.price,
    //         price: productHistory.price,
    //     }, { where: { id: productHistory.product_id }, individualHooks: true });
    // };
    // undoUpdatedProduct(1, 0);

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




