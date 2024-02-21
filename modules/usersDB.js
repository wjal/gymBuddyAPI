const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: String,
}
);

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


module.exports = class userDB {
  constructor() {
    // We don't have a `User` object until initialize() is complete
    this.User = null;
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
        this.User = db.model("userPool", userSchema);
        resolve();
      });
    });
  }

  async addNewUser(data) {
    const newUser = new this.User(data);
    await newUser.save();
    return newUser;
  }

  getAllUsers(page, perPage) {
    let findBy = {};
    
    if (+page && +perPage) {
      return this.User.find(findBy).skip((page - 1) * +perPage).limit(+perPage).exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  getUserById(id) {
    return this.User.findOne({ _id: id }).exec();
  }

  updateUserById(data, id) {
    return this.User.updateOne({ _id: id }, { $set: data }).exec();
  }

  deleteUserById(id) {
    return this.User.deleteOne({ _id: id }).exec();
  }
}