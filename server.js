const express = require("express");
const mongoose = require("mongoose");
const User = require("./stagethree/usermodel");
// initializing express
const app = express();

// connecting to database
mongoose
  .connect("mongodb://localhost/pagination", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("database is connected to mongodb://localhost/pagination")
  )
  .catch(() => console.log("error connecting to database"));

//   initializing db to mongoose connectin method
const db = mongoose.connection;

// inserting data to the user collection database
db.once("open", async () => {
  if ((await User.countDocuments().exec()) > 0)
    return console.log("user already inserted to database");

  Promise.all([
    User.create({ name: "user1" }),
    User.create({ name: "user2" }),
    User.create({ name: "user3" }),
    User.create({ name: "user4" }),
    User.create({ name: "user5" }),
    User.create({ name: "user6" }),
    User.create({ name: "user7" }),
    User.create({ name: "user8" }),
    User.create({ name: "user9" }),
    User.create({ name: "user10" }),
  ])
    .then(() => console.log("Added users to database"))
    .catch(() => console.log("error occured while inserting data to database"));
});

app.get("/users", paginate(User), (req, res) => {
  res.json(res.paginatedResult);
});

function paginate(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    if (endIndex < (await model.countDocuments().exec())) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      result.results = await model.find().limit(limit).skip(startIndex);
      res.paginatedResult = result;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
    // result.results = model.slice(startIndex, endIndex);
  };
}
// creating a port for server to listen on
app.listen(3000, () => {
  console.log("server started on port 3000");
});
