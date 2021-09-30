const { models, Product, User } = require('../model');
const { sequelize } = require("../sequelize");
const fs = require('fs');
const StreamArray = require('stream-json/streamers/StreamArray');
const { Worker } = require('worker_threads');

async function update1(model, pk, changes) {
    try {
        //check for existance of id 
        const ids = [];
        await model.findAll({ attributes: ['id'] }).then(data => {
            data.forEach(p => { ids.push(p.dataValues.id); });
        }).catch(err => { console.log(err); });
        if (!ids.includes(pk)) { throw new Error('model Id not exist in databae'); }

        //find out model attributes
        const modelAttr = [];
        for (let key in model.rawAttributes) { modelAttr.push(key); };
        const changeArr = Object.keys(changes);

        //if change object are empty then retrun from function 
        if (changeArr.length === 0) { throw new Error('there is no changes'); }

        //if change object are not valid in model attributes
        if (!modelAttr.includes(...changeArr)) { throw new Error('changes object not exist in model object pls recheck the object keys'); }

        //check for equality of changes to pre values
        const modelfeilds = await model.findByPk(pk);
        for (let key in changes) {
            if (modelfeilds[key] === changes[key]) { delete changes[key]; }
        }
        if (Object.keys(changes).length === 0) { throw new Error('change object are equal to perevius values'); }

        //update procces
        await model.update(changes, { where: { id: pk }, individualHooks: true }).
            then(() => { console.log('user updated'); })
            .catch(err => { console.log(err); });
    }
    catch (error) { console.log(error.message); }
}
// update1(User, 1, { firstName: 'hjkhjk',lastName:'hggghk' }).then(data=>{  process.exit(1);})

async function create() {
    // await fs.createReadStream('./test/data.json')
    //     .pipe(StreamArray.withParser())
    //     .on('data', async row => {
    //         const firstName = row.value.name.split(' ')[0];
    //         const lastName = row.value.name.split(' ')[1];
    //         console.log(firstName, lastName);
    //         User.create({ firstName: firstName, lastName: lastName });
    //     })
    //     .on('error', err => { })
    //     .on('end', () => {
    //         console.log('bulkcreate ended');
    //     });


    // resolve(process.exit(1));


    await User.bulkCreate([
        { firstName: 'hadi', lastName: 'arbabi' },
        { firstName: 'ahmad', lastName: 'asadi' },
        { firstName: 'ali', lastName: 'mashali' },]).then((data) => {
            console.log('users created');
        }).catch(err => { console.log(err); });
    await Product.bulkCreate([
        { title: 'apple', price: 610, store: 5, userId: 1 },
        { title: 'car', price: 25000, store: 1, userId: 2 },
        { title: 'bike', price: 3000, store: 1, userId: 2 },
        { title: 'blackboard', price: 300, store: 1, userId: 3 },
        { title: 'chair', price: 1633, store: 1, userId: 1 },]).then((data) => {
            console.log('products created');
        }).catch(err => { console.log(err); });
};
create().then(data => {  });