const { sequelize } = require('./sequelize');

const sync = async (state) => {
    let stateObj = {}
    Object.assign(stateObj,{[JSON.parse(JSON.stringify(state))]:true})
    await sequelize.sync({...stateObj});
};

const authentiacete = async () => { await sequelize.authenticate(); };

module.exports = { sync, authentiacete };