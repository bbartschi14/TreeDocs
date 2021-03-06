/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Project = require("./models/project");
// import authentication library
const auth = require("./auth");
// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.post("/project", auth.ensureLoggedIn, (req, res) => {
  const newProject = new Project({
    creator_id: req.user._id,
    projectData: req.body.projectData,
    name: req.body.name,
    dateModified: req.body.dateModified,
  });

  newProject.save().then((project) => res.send(project));
});

router.post("/projectUpdate", auth.ensureLoggedIn, (req, res) => {
  Project.findById(req.body._id).then((project) => {
    project.projectData = req.body.projectData;
    project.name = req.body.name;
    project.dateModified = req.body.dateModified;
    project.save();
  });
});

router.get("/projectSingle", auth.ensureLoggedIn, (req, res) => {
  Project.findById(req.query._id).then((project) => {
    let parsedProject = JSON.parse(project.projectData);
    res.send(parsedProject);
  });
});

router.get("/projectNames", auth.ensureLoggedIn, (req, res) => {
  Project.find({ creator_id: req.query.creator_id }).then((projects) => {
    let objects = projects.map((p) => {
      return { _id: p._id, name: p.name, dateModified: p.dateModified };
    });
    res.send(objects);
  });
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
