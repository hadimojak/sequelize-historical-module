# cobex-sequelize-Journaling

hooks.js : this file is Responsible for creating hooks in sequelize models and
        all the hooks are export from the file and requier and intialize in 
        app.js file .

app.js : runs simple express server fro one route('/') on localhost:3000 and
        virtualize create - update - delete - undoDelete - undoUpdate action 
        in for example mysql database that hooks class is  called and initialized
        in the beginning of the file . at the end authenticate the connection 
        throw db and run the server .

model.js : build all the models and history models.Unfortunately (my bad) in this 
        package you have to manualy create model and histroy model and once sync 
        with {force:true} to create the model and history model tables .

trigger-on-mysql.sql : it is an paractical sql mysql trigger for my two models .

sequelize.js : create sequelize connection and exports required tools for usage 
        in other files .

sync.js : define sync and authenticate function of sequelzie and exports them .

USAGE : for use this package you have to create model and history model and then 
        initialize Hooks class and pass them as parameter to hooks instance and 
        the call the throwHook at the end just like i do in app.js file .





                               ... end ...