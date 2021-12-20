const { response } = require("express");
const express = require("express");

const app = express();
app.get("/", (req, res, next) => {
  console.log("I am Default");
  next();
});
app.get("/", (req, res, next) => {
  console.log("I am also Default");
  next();
  //res.send("<h1>I am Default</h1>");
});
app.get("/a", (req, res, next) => {
  console.log("I am A");
  next();
});
app.get("/b", (req, res, next) => {
  console.log("I am B");
  res.send("<h1>B</h1>");
});
app.get("/", (req, res, next) => {
  console.log("I am also Default");
  //next();
  res.send("<h1>I am Last Default</h1>");
});
app.listen(3000);
