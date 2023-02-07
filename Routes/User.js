const User = require("../Models/User");
const router = require("express").Router();

router.get("/users", (req, res) => {
  if (!req.session.user)
    return res.status(403).json({ message: "Unauthorized access!" });
  User.find().exec((err, users) => {
    if (err) return res.status(500).json({ message: "Internal Server Error!" });
    res.status(200).json({ users });
  });
});

router.post("/login", (req, res) => {
  const { username } = req.query;
  if (!username)
    return res.status(404).json({ message: "Enter the username!" });
  User.findOne({ username }).exec((err, user) => {
    if (err) return res.status(500).json({ message: "Internal Server Error!" });

    if (!user) return res.status(404).json({ message: "User not found!" });
    req.session.user = user;
    return res.status(200).json({ user });
  });
});

router.post("/signup", (req, res) => {
  const { name, email, username, imagelink } = req.body;
  if (!username || !email || !name)
    return res.status(400).json({ message: "Please fill all the fields!" });
  const user = new User({ name, email, username, imagelink });
  user.save((err, user) => {
    if (err) return res.status(500).json({ message: "Internal Server Error!" });
    req.session.user = user;
    return res.status(200).json({ user });
  });
});

router.get("/user", (req, res) => {
  if (!req.session.user)
    return res.status(404).json({ message: "No user exists!" });
  return res.status(200).json({ user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Internal Server Error!" });
    return res.status(200).json({ message: "Successfully logged out!" });
  });
});

module.exports = router;
