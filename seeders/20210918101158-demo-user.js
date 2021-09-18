'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.bulkInsert('User', [{
      firstName: 'John',
      lastName: 'due',
      age: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    
     
      await queryInterface.bulkDelete('User', null, {});
     
  }
};
