const express = require('express');
const path = require("path");
const cors = require('cors');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const usersDB = require("./modules/usersDB.js");
const workoutDB = require('./modules/workoutDB.js')
const req = require('express/lib/request');
const { stringify } = require('querystring');

const wDB = new workoutDB();
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

  //retrieve workouts (optional query), page, and perPage (both required) - working
  app.get("/api/workouts", (req, res)=>{
    
    wDB.getAllWorkouts(1, 25)
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
          .send(`Unable To Find Workouts`);
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

  //add a workout object to User database - working

  app.post("/api/workouts", (req, res)=>{
    wDB.addNewWorkout(req.body)
    .then(newWorkout=>{
      if(newWorkout == null){
        res
          .status(204)
          .send(`Unable To Add Workout`)
      }
      res
        .status(201)
        .json(newWorkout)
      }).catch(err=>{
          res
            .status(500)
            .send(`Unable To Add Workout`);
            console.log(err);
      })
  });

  //update single user from user database by id paramater - working
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

  //delete a single user from user database by id parameter - working
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
  
  
 
  db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    wDB.initialize(process.env.MONGODB_CONN_STRING_WORKOUTS).then(app.listen(HTTP_PORT, httpStart))
      
  }).catch((err)=>{
      console.log(err);
  });