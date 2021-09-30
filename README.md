# sequelize-Journaling

**hooks.js** : this file is Responsible for creating hooks in sequelize models \
&nbsp;&emsp;and all the hooks are export from the file and require and initialize in **app.js** \
&nbsp;&emsp;file.

**test.js** : runs simple express server for one route('/') on localhost:3000 and \
&nbsp;&emsp;virtualize create - update - delete - undoDelete - undoUpdate action in for \
&nbsp;&emsp;example MySQL database that hooks class is called and initialized in the \
&nbsp;&emsp;beginning of the file. At the end authenticate the connection throw db and \
&nbsp;&emsp;run the server.

**model.js** : build all the models once sync with {alter:true} to create the model.

**trigger-on-mysql.sql** : It is a practical SQL queries  MySQL triggers for my two models.

**sequelize.js** : Create sequelize connection and exports required tools for usage \
&nbsp;&emsp;in other files.

**sync.js** : Define sync and authenticate function of sequelzie and exports them.

**unitTest.js** : Suppose that you created your model and run the server and connect \
&nbsp;&emsp;to db and create table and history tables then you can use this file to do \
&nbsp;&emsp;action to your database for test performance, etc.


## Installation

&nbsp;&emsp;Use the package manager [npm](https://www.npmjs.com/) to install sequelize-Journaling.

```bash
npm i --save sequelize-Journaling
```

## Usage

&nbsp;&emsp;For use this package you need to create your models (as you can see i create \
&nbsp;&emsp;User and Product model) and then initialize Hook class and pass model instance\
&nbsp;&emsp;as a parameter to hook instance and the call the throwHook at the end just \
&nbsp;&emsp;like I do in **test.js** file.

```javascript
const hooks = require("./hooks");

new hook(req, p, modelHistory, { fullRow: false }).throwHook();
```
## code flow
&nbsp;&emsp;Create models in **models.js** and sync them, pass models array from **models.js** \
&nbsp;&emsp;to **test.js** and instance from **sequelize.js** to **test.js**, initialize the \
&nbsp;&emsp;**hook.js** file, define and sync history model in **hook.js** file with the help of \
&nbsp;&emsp;requiring **hook.js**, test the functionality with different method in **test.js**.

# end
