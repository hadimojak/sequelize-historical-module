const User = require('./User');
const Product = require('./Product');

// User.create({ firstName: 'mari', lastName: 'arbabi' }).then(() => { console.log('user created'); });
// User.update({ firstName: 'alireza' }, { where: { firstName: 'ali' } })
//     .then(() => { console.log('user updated'); });


Product.create({ title: 'bikkke', price: 2000, UserId: 1 }).then(() => { console.log('product created'); });

// const ali = User.build({ firstName: 'ali', lastName: 'gholi' });

// ali.save().then(() => { console.log('use created'); });
