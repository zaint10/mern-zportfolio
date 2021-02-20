const { response } = require("express");
const mongoose = require("mongoose");


class DBConnection{
    constructor(DB_CONNECTION_STRING){
        this.DB_CONNECTION_STRING = DB_CONNECTION_STRING
    }

    connect() {
      
        mongoose
          .connect(this.DB_CONNECTION_STRING, { useNewUrlParser: true,  useUnifiedTopology: true })
          .then((response) => {
            console.log("Mongo DB is connected"); 
          })
          .catch((err) => {
            console.log("MongoDB Connection Error");
            console.log(err)
          });

          
      }
}


module.exports = DBConnection
