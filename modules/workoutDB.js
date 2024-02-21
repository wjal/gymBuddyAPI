const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const workoutSchema = new Schema({
    id: Number,
    type: String,
    exercises: [String],
}
);

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


module.exports = class workoutDB {
  constructor() {
    this.Workout = null;
  }
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(
        connectionString,
        clientOptions
      );

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Workout = db.model("workouts", workoutSchema);
        resolve();
      });
    });
  }

  async addNewWorkout(data) {
    const newWorkout = new this.Workout(data);
    await newWorkout.save();
    return newWorkout;
  }

  getAllWorkouts(page, perPage) {
    let findBy = {};
    
    if (+page && +perPage) {
      return this.Workout.find(findBy).skip((page - 1) * +perPage).limit(+perPage).exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  getWorkoutById(id) {
    return this.Workout.findOne({ id: id }).exec();
  }

  updateWorkoutById(data, id) {
    return this.Workout.updateOne({ id: id }, { $set: data }).exec();
  }

  deleteWorkoutById(id) {
    return this.Workout.deleteOne({ id: id }).exec();
  }
}