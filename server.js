const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const Comment = require("./models/comment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const app = express();

const jWT_SECRET = "efviojjnkfeihjohefoire387349029wqsj2jiew2hudsi";

mongoose.connect("mongodb://localhost:27017/register-app-db", {
  useNewUrlparser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ status: "400", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, email: user.email }, jWT_SECRET);
    console.log("hello");
    return res.json({ status: "200", data: token });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(password);
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name: name,
      email: email,
      password: hash,
    })
      .then((response) => {
        console.log(response);
        return res.json({ status: 200 });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.json({ stats: "error", message: "email already in use" });
        }
        throw err;
      });
  });

  // console.log(password);

  // try {
  //   const response = await User.create({ name, email, password });
  //   console.log(response);
  // } catch (error) {
  //   console.log(error.message);
  //   if (error.code === 11000) {
  //     return res.json({ status: "error", message: "email already in use" });
  //   }
  //   throw error;
  // }
});

app.post("/api/comments", (req, res) => {
  const { text, authorId, parent = null } = req.body;
  console.log("-----", req.body);
  console.log(text, authorId, parent);
  const createdAt = new Date();
  Comment.create({
    text,
    authorId,
    createdAt,
    parent,
  }).then((response) => {
    console.log(response);
    res.status(202).json({ status: 202, message: "successfully created" });
  });
});

app.get("/api/comments", async (req, res) => {
  res.json(await Comment.find());
});

app.patch("/api/comments/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("----", req.body);
    const updates = req.body;
    const result = await Comment.findByIdAndUpdate(id, updates);
    req.setEncoding(result);
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000);
