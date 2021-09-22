const epxress = require('express');
const app = epxress();
const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { sync, authentiacete } = require('./sync');
const { Product, User, UserHistory, ProductHistory } = require('./model');
const hooks = require('./hooks');


app.get('/', (req, res, next) => {
    new hooks(req, User, UserHistory, {}).throwHook();
    new hooks(req, Product, ProductHistory, {}).throwHook();

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
    //         }).catch(err => { console.log(err); });
    // };
    // create();

    // async function update1(model, pk, changes) {
    //     try {
    //         const modelAttr = [];
    //         const ids = [];
    //         await model.findAll({ attributes: ['id'] }).then(data => {
    //             data.forEach(p => { ids.push(p.dataValues.id); });
    //         }).catch(err => { console.log(err); });
    //         if (!ids.includes(pk)) { throw new Error('model Id not exist in databae'); }
    //         for (let key in model.rawAttributes) { modelAttr.push(key); };
    //         const changeArr = Object.keys(changes);
    //         changeArr.forEach(p => {
    //             if (!modelAttr.includes(p)) {
    //                 throw new Error('changes object not exist in model object pls recheck the object keys');
    //             }
    //         });
    //         model.update(changes, { where: { id: pk }, individualHooks: true }).
    //             then(() => { console.log('user updated'); })
    //             .catch(err => { console.log(err); });
    //     } catch (error) { console.log(error.message); }
    // }
    // update1(User, 2, { name: 'antar', price: 15 });

    // async function destroy1(model, pk) {
    //     try {
    //         const ids = [];
    //         await model.findAll({ attributes: ['id'] }).then(data => {
    //             data.forEach(p => { ids.push(p.dataValues.id); });
    //         }).catch(err => { console.log(err); });
    //         if (!ids.includes(pk)) {
    //             throw new Error('model Id not exist in database or model just deleted');
    //         }
    //         model.destroy({ where: { id: pk }, individualHooks: true })
    //             .then(() => { console.log('product destroyed'); })
    //             .catch(err => { console.log(err); });
    //     } catch (error) { console.log(error.message); }
    // }
    // destroy1(Product, 2);

    // async function undo_delete(model, pk) {
    //     try {
    //         req.undo = true;
    //         const ids = [];
    //         await model.findAll({ attributes: ['id'], paranoid: false }).then(data => {
    //             data.forEach(p => { ids.push(p.dataValues.id); });
    //         }).catch(err => { console.log(err); });
    //         if (!ids.includes(pk)) { throw new Error('Id not exict in databae'); }
    //         await model.findByPk(pk, { paranoid: false }).then(data => {
    //             if (data.dataValues.deletedAt === null) {
    //                 throw new Error('this row is already restored or not deleted at all');
    //             }
    //         }).catch(err => { console.log(err); });
    //         const user = await model.findByPk(pk, { paranoid: false });
    //         await user.restore();
    //     } catch (error) { console.log(error.message); }
    // };
    // undo_delete(Product, 1);

    async function undo_update(model, modelHistory, pk, historyId) {
        req.undo = true;
        let tablename = model.tableName;
        tablename = tablename.slice(0, tablename.length - 1);
        let searchTerm = {};
        Object.assign(searchTerm, { [tablename + '_id']: pk });
        Object.assign(searchTerm, { opration: 'update' });
        try {
            const ids = [];
            await model.findAll({ attributes: ['id'] }).then(data => {
                data.forEach(p => {
                    ids.push(p.dataValues.id);
                });
            }).catch(err => { console.log(err); });
            if (!ids.includes(pk)) {
                throw new Error('Id not exict in databae');
            }
            const arrayHistory = await modelHistory.
                findAll({ where: searchTerm });
            if (historyId >= arrayHistory.length) {
                throw new Error('your historyID is more than model history id');
            }
            const history = arrayHistory[historyId].dataValues;
            let modelHisAttr = [];
            for (let key in history) {
                modelHisAttr.push(key);
            }
            modelHisAttr = modelHisAttr.filter(p => {
                if (p !== 'createdAt' && p !== 'updatedAt' && p !== 'deletedAt' && p !== 'id' && p !== 'ip' && p !== 'restoredAt' && p !== 'opration' && p !== 'platform' && p !== Object.keys(history)[1]) {
                    return p;
                }
            });
            let undoTerm = {};
            for (let i = 0; i < modelHisAttr.length; i++) {
                let name = JSON.parse(JSON.stringify(modelHisAttr[i]));
                Object.assign(undoTerm, { [name]: history[name] });
            }
            await model.update({ ...undoTerm }, { where: { id: Object.values(history)[1] }, individualHooks: true });
        } catch (error) { console.log(error.message); }
    };
    undo_update(User, UserHistory, 1, 6);

    res.json('userIp');
});

authentiacete().then((async data => {
    try {
        await app.listen(3000);
        console.log('db connected & server runs');
    } catch (error) {
        throw new Error(error);
    }
})).catch(err => { console.log(err); });




