const User = require('./User');
const Product = require('./Product');

User.findOne({ where: { firstName: 'ali' } }).then(user => { console.log(user.dataValues); });;
    // then(users => {
    //     const userArray = [];
    //     console.log('user finded');
    //     users.forEach(p => { userArray.push(p.dataValues); });
    //     console.log(userArray);
    // });