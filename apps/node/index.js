const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.end("Disallow: /admin");
});

app.get("/admin", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.end("ADMIN :o");
});

app.get("/rxss", (req, res) => {
  res.render("rxss", { input: req.query.input });
});

app.get("/redirect", (req, res) => {
  const { input } = req.query;

  if (input) {
    res.redirect(input);
  } else {
    res.render("redirect", { input });
  }
});

app.listen(3000);
