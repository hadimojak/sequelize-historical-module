# sequelize-Journaling

\***\*hooks.js\*\*** : this file is Responsible for creating hooks in sequelize models \
&nbsp;&emsp;and all the hooks are export from the file and requier and intialize in app.js \
&nbsp;&emsp;file .

\***\*app.js\*\*** : runs simple express server fro one route('/') on localhost:3000 and \
&nbsp;&emsp;virtualize create - update - delete - undoDelete - undoUpdate action in for \
&nbsp;&emsp;example mysql database that hooks class is called and initialized in the \
&nbsp;&emsp;beginning of the file . at the end authenticate the connection throw db and \
&nbsp;&emsp;run the server .

\***\*model.js\*\*** : build all the models and history models.Unfortunately (my bad) in \
&nbsp;&emsp;this package you have to manualy create model and histroy model and once \
&nbsp;&emsp;sync with {force:true} to create the model and history model tables .

\***\*trigger-on-mysql.sql\*\*** : it is an paractical sql mysql trigger for my two models .

\***\*sequelize.js\*\*** : create sequelize connection and exports required tools for usage \
&nbsp;&emsp;in other files .

\***\*sync.js\*\*** : define sync and authenticate function of sequelzie and exports them .

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install sequelize-Journaling.

```bash
npm i --save sequelize-Journaling
```

## Usage

for use this package you have to create model and history model and then initialize Hooks &nbsp; 
class and pass them as parameter to hooks instance and the call the throwHook at the end  &nbsp;
just like i do in app.js file .

```javascript
const hooks = require("./hooks");

new hooks(req, User, UserHistory, { fullRow: false }).throwHook();
new hooks(req, Product, ProductHistory, { fullRow: false }).throwHook();
```
## Description

we are working on the functionality for building history Model and history table automaticly &nbsp;
and add hooks to them by the one instance of Hook class.

# end
