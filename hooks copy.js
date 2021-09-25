//require user agant for get the platform information and Anything you need from request
const useragent = require('express-useragent');
const { sequelize, Sequelize, DataTypes, Model } = require('./sequelize');
const { Product, User } = require('./model');

class Hooks {
    constructor(req, model, options) {
        const source = req.headers['user-agent'];
        this.ua = useragent.parse(source);
        this.userIp = req.ip
            || req.connection.remoteAddress
            || req.socket.remoteAddress
            || req.connection.socket.remoteAddress;
        this.model = model;
        this.modelHistory=
        this.req = req;
        
    
        //helper function for hooks
        this.hookHelper = function (user) {
            //findout what field shoud be changed
            const change = Array.from(user._changed);

            //creating for create an insert in model histories tables
            const body = {};

            // get values of histoy attrs 
            const values = Object.values(user._previousDataValues);

            //create for loops with the length of model history attributes for neccesary changes
            for (let i = 0; i < this.modelHisAttr.length; i++) {
                let name = JSON.parse(JSON.stringify(this.modelHisAttr[i]));
                if (options.fullRow) {
                    Object.assign(body, { [name]: values[i] });
                } else {

                    //this is for making sure that model_id is allways created in body object
                    if (i === 0) {
                        Object.assign(body, { [name]: values[i] });

                        //check for existance of items in changes array and if there is not match we use null for value of that column in the model history table
                    } else {
                        if (!change.includes(name)) {
                            Object.assign(body, { [name]: null });
                        } else {
                            Object.assign(body, { [name]: values[i] });
                        }
                    }

                }

            }
            return body;
        };
    }


    //throw hook like a butcher
    throwHook() {
        this.model.beforeUpdate(async (user, options) => {
            //build body object with the help of hookHelper function
            const body = this.hookHelper(user);
            // craete an insert in modelHistory
            await (this.model.getTableName()+'history').create({
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