const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const Signup = require("../models/SigninSchema");
const authenticate = require("../middleware/authenticate");

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadPr = multer({ storage: profileStorage });

router.post(
  "/api/signup",
  uploadPr.single("profilePhoto"),
  async (req, res) => {
    console.log("req: ", req.body, req.file);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json("please fill the data");
    }
    try {
      console.log("start signup process");
      const preEmail = await Signup.findOne({ email: email });
      if (preEmail) {
        res.status(403).json("this user is already present");
      } else {
        // console.log("ok");
        const newSignUp = new Signup({
          username: username,
          email: email,
          password: password,
          profilePhoto: req.file.path,
        });

        // console.log("ok");
        const storeSignup = await newSignUp.save();
        // console.log("ok");

        res.status(200).json({
          status: 200,
          storeSignup,
        });
      }
    } catch (err) {
      res.status(404).json(err);
      console.log("catched an error during signup");
    }
  }
);

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  if (!email || !password) {
    res.status(400).json("please fill the data");
  }
  try {
    console.log("start login process");
    const userValid = await Signup.findOne({ email: email });

    if (userValid) {
      // console.log("a");
      const isMatch = await bcrypt.compare(password, userValid.password);
      if (!isMatch) {
        console.log("something like password not matching");
        res.status(403).json({ error: "Password is incorrect" });
      } else {
        // console.log("b");
        // console.log("coming here");
        const token = await userValid.generateAuthtoken();
        // console.log("token: ", token);
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 28800000), //token expires in 1 hour
          httpOnly: true,
        });

        // console.log("c");
        const result = {
          userValid,
          token,
        };
        // console.log("result: ", result);
        res
          .status(200)
          .json({ status: 200, result, msg: "Successfully authenticated" });
      }
    } else {
      console.log("email not matching");
      res.status(401).json({ error: "email is not used till now.." });
    }
  } catch (err) {
    res.status(404).json(err);
    console.log("catched an error during login");
  }
});

router.get("/api/validuser", authenticate, async (req, res) => {
  try {
    // console.log("testing for data: ", req.rootuser[0]);
    const validuserone = await Signup.findOne({ _id: req.userid });
    res.status(200).json({ status: 200, validuserone });
  } catch (error) {
    res.status(401).json({ status: 401, validuserone });
  }
});

router.get("/api/logout", authenticate, async (req, res) => {
  try {
    req.rootuser.tokens = req.rootuser[0].tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });
    res.clearCookie("usercookie", { path: "/" });
    req.rootuser[0].save();
    res.status(200).json({ status: 200, message: "good going" });
  } catch (error) {
    res.status(401).json({ status: 401, message: "not good going" });
  }
});

module.exports = router;
