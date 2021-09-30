# sequelize-Journaling

**hooks.js** : this file is Responsible for creating hooks in sequelize models \
&nbsp;&emsp;and all the hooks are export from the file and require and initialize in app.js \
&nbsp;&emsp;file.

**test.js** : runs simple express server for one route('/') on localhost:3000 and \
&nbsp;&emsp;virtualize create - update - delete - undoDelete - undoUpdate action in for \
&nbsp;&emsp;example MySQL database that hooks class is called and initialized in the \
&nbsp;&emsp;beginning of the file. At the end authenticate the connection throw db and \
&nbsp;&emsp;run the server.

**model.js** : build all the models once sync with {alter:true} to create the model.

**trigger-on-mysql.sql** :  It is a practical SQL queries  MySQL triggers for my two models.

**sequelize.js** : Create sequelize connection and exports required tools for usage \
&nbsp;&emsp;in other files.

**sync.js** : Define sync and authenticate function of sequelzie and exports them.

**unitTest.js** : Suppose that you created your model and run the server and connect &nbsp;
to db and create table and history tables then you can use this file to do action to your &nbsp;
database for test performance, etc.


## Installation

Use the package manager [npm](https://www.npmjs.com/) to install sequelize-Journaling.

```bash
npm i --save sequelize-Journaling
```

## Usage

For use this package you need to create your models (as you can see i create User and Product model) &nbsp;
and then initialize Hook class and pass model instance as parameter to hook instance and the call the &nbsp;
throwHook at the end just like I do in test.js file.

```javascript
const hooks = require("./hooks");

new hook(req, p, modelHistory, { fullRow: false }).throwHook();
```
## code flow
Create models in models.js and sync them, pass models array from model.js to test.js and sequelize &nbsp;
instance from sequelize.js to test.js, initialize the hook.js file, define and sync history model in &nbsp;
hook.js file with the help of requiring hook.js, test the functionality with different method in test.js.

# end
