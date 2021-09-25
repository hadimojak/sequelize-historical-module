const epxress = require("express");
const app = epxress();
const { sequelize, Sequelize, DataTypes, Model } = require("./sequelize");
const { sync, authentiacete } = require("./sync");
const { Product, User, UserHistory, ProductHistory } = require("./model");
const hooks = require("./hooks");

app.get("/", (req, res, next) => {
  //initialize the hooks for models
  new hooks(req, User, {fullRow: false, journalTablePostfix:"history"});
//   new hooks(req, Product, ProductHistory, { fullRow: false }).throwHook();

  //create multiple insert in database and It's easy to see

  async function create() {
    User.bulkCreate([
      { firstName: "hadi", lastName: "arbabi" },
      { firstName: "ahmad", lastName: "asadi" },
      { firstName: "ali", lastName: "mashali" },
    ])
      .then(() => {
        console.log("user created");
        Product.bulkCreate([
          { title: "apple", price: 610, store: 5, userId: 1 },
          { title: "car", price: 25000, store: 1, userId: 2 },
          { title: "bike", price: 3000, store: 1, userId: 2 },
          { title: "blackboard", price: 300, store: 1, userId: 3 },
          { title: "chair", price: 1633, store: 1, userId: 1 },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // create();

  // update single row of any model

  async function update1(model, pk, changes) {
    try {
      //check for existance of id
      const ids = [];
      await model
        .findAll({ attributes: ["id"] })
        .then((data) => {
          data.forEach((p) => {
            ids.push(p.dataValues.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      if (!ids.includes(pk)) {
        throw new Error("model Id not exist in databae");
      }

      //find out model attributes
      const modelAttr = [];
      for (let key in model.rawAttributes) {
        modelAttr.push(key);
      }
      const changeArr = Object.keys(changes);

      //if change object are empty then retrun from function
      if (changeArr.length === 0) {
        throw new Error("there is no changes");
      }

      //if change object are not valid in model attributes
      if (!modelAttr.includes(...changeArr)) {
        throw new Error(
          "changes object not exist in model object pls recheck the object keys"
        );
      }

      //update procces
      await model
        .update(changes, { where: { id: pk }, individualHooks: true })
        .then(() => {
          console.log("user updated");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error.message);
    }
  }
  // update1(User, 1, { firstName: 'zerzan', lastName: 'ahmad' });

  //destroy single row of any model

  async function destroy(model, pk) {
    try {
      //check for existance or invalidity of id
      const ids = [];
      await model
        .findAll({ attributes: ["id"] })
        .then((data) => {
          data.forEach((p) => {
            ids.push(p.dataValues.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      if (!ids.includes(pk)) {
        throw new Error(
          "model Id not exist in database or model already deleted"
        );
      }

      //destroy process
      model
        .destroy({ where: { id: pk }, individualHooks: true })
        .then(() => {
          console.log("product destroyed");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error.message);
    }
  }
  // destroy(User, 1);

  //undo delete on any model

  async function undoDelete(model, pk) {
    try {
      //store undo key in request object for usage in Hooks class
      req.undo = true;

      //check for existance  of id
      const ids = [];
      await model
        .findAll({ attributes: ["id"], paranoid: false })
        .then((data) => {
          data.forEach((p) => {
            ids.push(p.dataValues.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      if (!ids.includes(pk)) {
        throw new Error("Id not exist in databae");
      }

      //check for invalidity  of id
      await model
        .findByPk(pk, { paranoid: false })
        .then(async (data) => {
          if (data.dataValues.deletedAt === null) {
            throw new Error(
              "this row is already restored or not deleted at all"
            );
          }
          //undo-delete(restore) process
          const user = await model.findByPk(pk, { paranoid: false });
          await user.restore();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error.message);
    }
  }
  // undoDelete(User, 2);

  //undo-update on any model

  async function undoUpdate(model, modelHistory, pk, historyId) {
    //store undo key in request object for usage in Hooks class
    req.undo = true;

    //get table Name from model and remove plural "S" from the end of table name
    let tablename = model.tableName;
    tablename = tablename.slice(0, tablename.length - 1);

    //creating search term object
    let searchTerm = {};

    //user_id product_id and etc ...
    Object.assign(searchTerm, { [tablename + "_id"]: pk });

    //opration in hardcoded it can be parameter but It does not have a dramatic effect
    Object.assign(searchTerm, { opration: "update" });

    try {
      //check for existance  of id
      const ids = [];
      await model
        .findAll({ attributes: ["id"] })
        .then((data) => {
          data.forEach((p) => {
            ids.push(p.dataValues.id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      if (!ids.includes(pk)) {
        throw new Error("Id not exict in databae");
      }

      //get the array for history of changes  of exact model_id and order by history_id(this is named id in history model)
      const arrayHistory = await modelHistory.findAll({
        where: searchTerm,
        order: [["id", "ASC"]],
      });

      //check for existance of historyId in arrayHistroy of exact model_id
      if (historyId >= arrayHistory.length) {
        throw new Error("your historyID is more than model history id");
      }

      //history object must be update to dataBase where id = Object.values(history)[1] (modelname_id like user_id , product_id , etc)
      const history = arrayHistory[historyId].dataValues;

      //get model history attribute and detach Unnecessary items from it
      let modelHisAttr = [];
      for (let key in history) {
        modelHisAttr.push(key);
      }
      modelHisAttr = modelHisAttr.filter((p) => {
        if (
          p !== "createdAt" &&
          p !== "updatedAt" &&
          p !== "deletedAt" &&
          p !== "id" &&
          p !== "ip" &&
          p !== "restoredAt" &&
          p !== "opration" &&
          p !== "platform" &&
          p !== Object.keys(history)[1]
        ) {
          return p;
        }
      });

      //creating undo object
      let undoObject = {};
      for (let i = 0; i < modelHisAttr.length; i++) {
        let name = JSON.parse(JSON.stringify(modelHisAttr[i]));
        //remember to just create key value pair for available values and skip null values
        if (history[name] === null) {
          break;
        }
        Object.assign(undoObject, { [name]: history[name] });
      }
      console.log(undoObject);

      //undo-update process
      await model.update(
        { ...undoObject },
        { where: { id: Object.values(history)[1] }, individualHooks: true }
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  // undoUpdate(User, UserHistory, 1, 1);

  //this is only for example
  res.json("userIp");
});

//we can although use sync('state') Instead of authentiacete with 'alter' and 'force' parameters
sync('alter')
// authentiacete()
  .then(async (data) => {
    try {
      await app.listen(3000);
      console.log("db connected & server runs");
    } catch (error) {
      throw new Error(error);
    }
  })
  .catch((err) => {
    console.log(err);
  });
