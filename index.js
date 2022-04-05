const connection = require('./db-config');
const express = require ('express');
const cors= require('cors');
const app = express ();

const port = 8000;
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected to database with threadId :  ' + connection.threadId);
  }
});
app.use(cors());
app.use(express.json());




app.listen (port, (err=>{
    if (err){
        console.error(`Something bad happened`);
        }else{
            console.log(`Server is listening on ${port}`);
        }
 }));
