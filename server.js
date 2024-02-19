const express = require('express');
const path = require("path");
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const usersDB = require("./modules/usersDB.js");
const req = require('express/lib/request');
const { stringify } = require('querystring');

const db = new usersDB();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const httpStart = function(){
  console.log("Ready to handle requests on port " + HTTP_PORT);
}


/***************************************************************/
/****                      MIDDLEWARE                 ****/
/***************************************************************/


app.use(express.json()); // built-in body-parser

app.use(cors());


/***************************************************************/
/****                      CRUD operations                  ****/
/***************************************************************/

//retrieve users (optional query), page, and perPage (both required) - working
app.get("/api/users", (req, res)=>{
    db.addNewUser({firstName: 'User',
        lastName: 'McUserFace',
        age: 100,
        email: 'user@email.com',})
    db.getAllUsers(1, 25)
    .then(data=>{
      if(data == null){
        res 
          .status(204)
          .send(`No Content Found`);
      }else{
      res
        .json(data)}
      }).catch(err=>{
        res
          .status(500)
          .send(`Unable To Find Users`);
          console.log(err);
        }
      )
  })
  //retrieve single user by id parameter - working
  app.get("/api/users/:id", (req, res)=>{
    db.getUsersById(req.params.id)
    .then(data=>{
      if(data == null){
      res
        .status(204)
        .send(`No Content Found`);
        }
      else{
        res 
          .json(data)}
      }).catch(err=>{
        res
          .status(500)
          .send(`Unable To Find User`);
          console.log(err)
      }
  
      )
      
  })
  //add a user object to User database - working
  app.post("/api/users", (req, res)=>{
    db.addNewUser(req.body)
    .then(newUser=>{
      if(newUser == null){
        res
          .status(204)
          .send(`Unable To Add User`)
      }
      res
        .status(201)
        .json(newUser)
      }).catch(err=>{
          res
            .status(500)
            .send(`Unable To Add User`);
            console.log(err);
      })
  });
  //update single user from movie database by id paramater - working
  app.put("/api/users/:id", (req, res)=>{
    db.updateUserById(req.body, req.params.id)
    .then(data=>{
      if(data == null){
        res 
          .status(204)
          .send(`Unable To Edit User`);
      }else{
        res
          .status(201)
          .json(data)}
      }).catch(err=>{
        res
          .status(500)
          .send(`Unable To Edit User`);
          console.log(err)
    });
  })
  //delete a single user from movie database by id parameter - working
  app.delete("/api/users/:id", (req, res)=>{
    db.deleteUserById(req.params.id)
    .then(data=>{
      if(data == null){
        res 
          .status(204)
          .send(`Unable To Delete User`);
      }else{
        res
          .status(200)
          .json(data)}
      }).catch(err=>{
        res
          .status(500)
          .send(`Unable To Delete User`);
          console.log(err);
      });
  })
  
  
  app.use((req, res) => {
      res.status(404).send("Resource not found");
  });
  
  
  // Tell the app to start listening for requests
  //connection to mongoDB Atlas is taking ~20seconds when connecting on my local machine, but is working faster on cyclic
  
  db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
      app.listen(HTTP_PORT, httpStart);
  }).catch((err)=>{
      console.log(err);
  });