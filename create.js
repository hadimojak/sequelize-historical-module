const User = require('./User');
const Product = require('./Product');

// User.create({ firstName: 'hadi', lastName: 'arbabi' }).then(() => { console.log('user created'); });


Product.create({ title: 'car', price: 2000 }).then(() => { console.log('product created'); });