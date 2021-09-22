// const { User, UserHistory, Product, ProductHistory } = require('./model');
const useragent = require('express-useragent');
const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');

class Hooks {
    constructor(req, model, modelHistory) {
        const source = req.headers['user-agent'];
        this.ua = useragent.parse(source);
        this.userIp = req.ip
            || req.connection.remoteAddress
            || req.socket.remoteAddress
            || req.connection.socket.remoteAddress;
        this.model = model;
        this.modelHistory = modelHistory;
        this.req = req;
        //measurement dynamic attribute in model history
        this.modelHisAttr = [];
        for (let key in this.modelHistory.rawAttributes) {
            this.modelHisAttr.push(key);
        }
        this.modelHisAttr = this.modelHisAttr.filter(p => {
            if (p !== 'createdAt' && p !== 'updatedAt' && p !== 'deletedAt'
                && p !== 'id' && p !== 'ip' && p !== 'restoredAt'
                && p !== 'opration' && p !== 'platform') {
                return p;
            }
        });
        //helper function for hooks
        this.hookHelper = function (user) {
            // const change = Array.from(user._changed);
            const body = {};
            const values = Object.values(user._previousDataValues);
            for (let i = 0; i < this.modelHisAttr.length; i++) {
                let name = JSON.parse(JSON.stringify(this.modelHisAttr[i]));
                Object.assign(body, { [name]: values[i] });
                // if (i === 0 ) {
                //     Object.assign(body, { [name]: values[i] });
                // } else {
                //     if (!change.includes(name)) {
                //         Object.assign(body, { [name]: null });
                //     } else {
                //         Object.assign(body, { [name]: values[i] });
                //     }
                // }

            }
            return body;
        };
    }

    throwHook() {
        this.model.beforeUpdate(async (user, options) => {
            const body = this.hookHelper(user);
            await this.modelHistory.create({
                ...body,
                opration: this.req.undo ? 'undo-update' : 'update',
                ip: this.userIp,
                platform: this.ua.platform,
                restoredAt: this.req.undo ? new Date() : null
            });
        });
        this.model.beforeDestroy(async (user, options) => {
            const body = this.hookHelper(user);
            await this.modelHistory.create({
                ...body,
                opration: 'delete',
                ip: this.userIp,
                platform: this.ua.platform,
                restoredAt: null
            });
        });
        this.model.beforeRestore(async (user, options) => {
            const body = this.hookHelper(user);
            await this.modelHistory.create({
                ...body,
                opration: 'undo-delete',
                ip: this.userIp,
                platform: this.ua.platform,
                restoredAt: this.req.undo ? new Date() : null
            });
        });


    }
}
module.exports = Hooks;