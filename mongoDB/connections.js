const mongoose = require("mongoose");

let {Logger} = require("../utilities");

Logger = new Logger();
Logger.setLogName('mongoDB');
Logger.init();

class DBConnection{
    constructor(DB_CONNECTION_STRING){
        this.DB_CONNECTION_STRING = DB_CONNECTION_STRING
    }

    connect() {
      
        mongoose
          .connect(this.DB_CONNECTION_STRING, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true })
          .then((response) => {
            Logger.info("Mongo DB is connected"); 
          })
          .catch((err) => {
            Logger.error("MongoDB Connection Error");
            Logger.error(err)
          });

          
      }
}


module.exports = DBConnection
