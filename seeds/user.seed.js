const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");
const { faker } = require("@faker-js/faker");

const userList = [];

for (let i = 0; i < 10; i++) {
  const user = new User({
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  });

  userList.push(user);
}

console.log(userList);

const userSeed = async () => {
  try {
    const database = await connect();
    await User.collection.drop();
    console.log("Borrados users");
    await User.insertMany(userList);
    console.log("Creados users correctamente");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

userSeed();
