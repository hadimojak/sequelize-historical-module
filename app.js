const epxress = require('express');
const app = epxress();
const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { sync } = require('./sync');
const { Product, User, UserHistory } = require('./model');
const { findIp } = require('./ipFinder');
const useragent = require('express-useragent');



app.get('/', (req, res, next) => {
    User.beforeUpdate(async (user, options) => {
        const userIp = await findIp();
        await UserHistory.create({
            user_id: user._previousDataValues.id,
            firstName: user._previousDataValues.firstName,
            lastName: user._previousDataValues.lastName,
            opration: 'update',
            ip: userIp,
            platform: useragent.parse(req.headers['user-agent'].platform)
        });
    });
    const source = req.headers['user-agent'];
    const ua = useragent.parse(source);
    console.log(ua.platform, ua.browser);

    async function update() {
        const userIp = await findIp();
        User.update({ lastName: 'kalim ', ip: userIp }, { where: { id: 1 } }).then(() => { console.log('user updated'); });
    }
    update();

    res.json(JSON.stringify(ua.platform));
});



sync().then((async data => {
    try {
        await app.listen(3000);
        console.log('db connected & server runs');
    } catch (error) {
        throw new Error(error);
    }

}));;



// User.beforeDestroy(async (user, options) => {
//     const userIp =await findIp();
//     await UserHistory.create({
//         user_id: user._previousDataValues.id,
//         firstName: user._previousDataValues.firstName,
//         lastName: user._previousDataValues.lastName,
//         opration: 'delete',
//         ip: userIp
//     });
// });





// User.destroy({ where: { id: 1 } }).then(() => { console.log('user destroyed'); });





// const undo = async () => {
//     let lastHis = await sequelize.query(`SELECT id,
// firstName,
// lastName,
// createdAt,
// updatedAt,
// deletedAt
// FROM userhistories
// where id = 1
// order by hid desc
// limit 1;`);
//     lastHis = lastHis[0][0];
//     console.log(lastHis);
//     // await User.create({ firstName: lastHis.firstName, lastName: lastHis.lastName, id: lastHis.id });
//     await sequelize.query(`UPDATE users
//     SET deletedAt = null
//     WHERE id = 1;`);
// };


// undo();


// async function create() {
//     const userIp = await findIp();
//     console.log(userIp);
//     User.create({ firstName: 'hadi', lastName: 'arbabi', ip: userIp }).then(() => {
//         console.log('user created');
//         Product.create({ title: 'ccc', price: 2000, UserId: 1 }).then(() => { console.log('product created'); });
//     });
// };
// create();

// User.destroy({ where: { id: 1 } }).then(() => { console.log('product removed'); });
// Product.destroy({ where: { id: 1 } }).then(() => { console.log('product updated'); });



