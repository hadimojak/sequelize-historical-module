//require user agant for get the platform information and Anything you need from request
const useragent = require("express-useragent");
const { sequelize, DataTypes, Sequelize, Model } = require("./sequelize");
const { sync, authentiacete } = require("./sync");

class Hooks {
  constructor(req, model, options) {
    const source = req.headers["user-agent"];
    this.ua = useragent.parse(source);
    this.userIp =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    this.model = model;
    this.req = req;

    this.modelAttr = []; 
    // for (let key in this.model.rawAttributes) {
    //   this.modelAttr.push(key);
    // }
    // for (let value of Object.values(this.model.rawAttributes)) {
    //     this.modelValues.push(value)
    //   }
        this.modelAttr =Object.entries(this.model.rawAttributes);

    this.modelAttr = this.modelAttr.filter((p) => {
      if (p !== "createdAt" && p !== "updatedAt" && p !== "deletedAt") {
        return p;
      }
    });
    let historyTableBody = {}
    Object.assign(historyTableBody,{[this.model.getTableName()+'_id']:{ type: DataTypes.INTEGER }})
    console.log(this.modelAttr)
    // for(let i =1 ;i<this.modelAttr.length;i++){
    //     Object.assign(historyTableBody,{[this.modelAttr[i]]:[this.modelValues[i]]})
    // }
    // Object.assign(historyTableBody,{[this.modelHisAttr[i]]:{
    //             type: DataTypes.STRING,
    //             allowNull: true
    //         }})
    // Object.assign(historyTableBody,{['firstName']:{
    //             type: DataTypes.STRING,
    //             allowNull: true
    //         }})
    // console.log(historyTableBody)

    //making history table name and history table
    let historyTableName =
      this.model.getTableName() + options.journalTablePostfix;

    const journalTable = sequelize.define(
      historyTableName,
      {...historyTableBody,
        ip: { type: DataTypes.STRING },
        opration: { type: DataTypes.STRING },
        platform: { type: DataTypes.STRING },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: new Date(),
        },
        restoredAt: {
          type: Sequelize.DATE,
          defaultValue: null,
        },
      },
      {
        sequelize: sequelize,
        timestamps: false,
        modelName: historyTableName,
        freezeTableName: true,
      }
    );
    sync("force");

    //measurement dynamic attribute in model history
    // this.modelHisAttr = [];
    // for (let key in this.modelHistory.rawAttributes) { this.modelHisAttr.push(key); }

    //detach unnecessary items from model history attributes and findout array of changed items which later use in hoolhelper func
    // this.modelHisAttr = this.modelHisAttr.filter(p => {
    //     if (p !== 'createdAt' && p !== 'updatedAt' && p !== 'deletedAt'
    //         && p !== 'id' && p !== 'ip' && p !== 'restoredAt'
    //         && p !== 'opration' && p !== 'platform') {
    //         return p;
    //     }
    // });

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
      await this.modelHistory.create({
        ...body,
        opration: this.req.undo ? "undo-update" : "update",
        ip: this.userIp,
        platform: this.ua.platform,
        restoredAt: this.req.undo ? new Date() : null,
      });
    });
    this.model.beforeDestroy(async (user, options) => {
      const body = this.hookHelper(user);
      await this.modelHistory.create({
        ...body,
        opration: "delete",
        ip: this.userIp,
        platform: this.ua.platform,
        restoredAt: null,
      });
    });
    this.model.beforeRestore(async (user, options) => {
      const body = this.hookHelper(user);
      await this.modelHistory.create({
        ...body,
        opration: "undo-delete",
        ip: this.userIp,
        platform: this.ua.platform,
        restoredAt: this.req.undo ? new Date() : null,
      });
    });
  }
}
module.exports = Hooks;
