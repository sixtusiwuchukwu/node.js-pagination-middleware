const express = require("express");
// initializing express
const app = express();

const users = [
  { id: 1, name: "user1" },
  { id: 2, name: "user2" },
  { id: 3, name: "user3" },
  { id: 4, name: "user4" },
  { id: 5, name: "user5" },
  { id: 6, name: "user6" },
  { id: 7, name: "user7" },
  { id: 8, name: "user8" },
  { id: 9, name: "user9" },
  { id: 10, name: "user10" },
];

const posts = [
  { id: 1, name: "post1" },
  { id: 2, name: "post2" },
  { id: 3, name: "post3" },
  { id: 4, name: "post4" },
  { id: 5, name: "post5" },
  { id: 6, name: "post6" },
  { id: 7, name: "post7" },
  { id: 8, name: "post8" },
  { id: 9, name: "post9" },
  { id: 10, name: "post10" },
];

app.get("/posts", paginate(posts), (req, res) => {
  res.json(res.paginatedResult);
});

app.get("/users", paginate(users), (req, res) => {
  res.json(res.paginatedResult);
});

function paginate(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    if (endIndex < model.length) {
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
    result.results = model.slice(startIndex, endIndex);
    res.paginatedResult = result;
    next();
  };
}
// creating a port for server to listen on
app.listen(3000, () => {
  console.log("server started on port 3000");
});
