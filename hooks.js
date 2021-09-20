const { User, UserHistory, Product, ProductHistory } = require('./model');
const useragent = require('express-useragent');


class UserHook extends User {
    constructor(req) {
        super();
        const source = req.headers['user-agent'];
        const ua = useragent.parse(source);
        const userIp = req.ip
            || req.connection.remoteAddress
            || req.socket.remoteAddress
            || req.connection.socket.remoteAddress;
        User.beforeUpdate(async (user, options) => {
            await UserHistory.create({
                user_id: user._previousDataValues.id,
                firstName: user._previousDataValues.firstName,
                lastName: user._previousDataValues.lastName,
                opration: 'update',
                ip: userIp,
                platform: ua.platform
            });
        });


        User.beforeDestroy(async (user, options) => {
            await UserHistory.create({
                user_id: user._previousDataValues.id,
                firstName: user._previousDataValues.firstName,
                lastName: user._previousDataValues.lastName,
                opration: 'delete',
                ip: userIp,
                platform: ua.platform
            });
        });
    }
}

class ProductHook extends Product {
    constructor(req) {
        super();
        const source = req.headers['user-agent'];
        const ua = useragent.parse(source);
        const userIp = req.ip
            || req.connection.remoteAddress
            || req.socket.remoteAddress
            || req.connection.socket.remoteAddress;

        Product.beforeUpdate(async (product, options) => {
            await ProductHistory.create({
                product_id: product._previousDataValues.id,
                title: product._previousDataValues.title,
                price: product._previousDataValues.price,
                opration: 'update',
                ip: userIp,
                platform: ua.platform
            });
        });


        Product.beforeDestroy(async (product, options) => {
            await ProductHistory.create({
                product_id: product._previousDataValues.id,
                title: product._previousDataValues.title,
                price: product._previousDataValues.price,
                opration: 'delete',
                ip: userIp,
                platform: ua.platform
            });
        });
    }
}

module.exports = { UserHook, ProductHook };