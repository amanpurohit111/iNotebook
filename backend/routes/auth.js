const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'amanisgoodb$oy';

//Route 1: create a user using: post "/api/auth/createuser" no login required
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    //if there are error, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //check whether the user exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this email exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password,salt)
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });
      // .then(user => res.json(user))
      // .catch(err=>{console.log(error)
      // res.json({error:'please enter a unique value for email'})})
      const data = {
        user: {
          id : user.id,
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
       const success = true;
       res.json({success, authtoken})
      //res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route2 :login a user using: post "/api/auth/login" no login required
router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").exists(),
  ],
  async (req, res) => {
    let success = false;

    //if there are error, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  

  const {email , password} = req.body;
  try{
   let user = await User.findOne({email});
   if(!user){
    success = false;
    return res.status(400).json({error:"please try to login correct info"})
   }

   const passwordCompare = await bcrypt.compare(password , user.password);
   if(!passwordCompare){
    success = false;
    return res.status(400).json({success, error:"please try to login correct info"})
   }
   const data = {
    user:{
      id: user.id
    }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
    res.json({success, authtoken})

  }catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

//Route 3: Get loggin user details using: post /api/auth/getuser ; login required
router.post(
  "/getuser",fetchuser,  async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user)
}catch (error) {
  console.error(error.message);
  res.status(500).send("internal server error");
}
  });
module.exports = router;
