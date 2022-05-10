const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email || !password){
      throw new Error("Please provide all values")
    }
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(401).json({msg: error.message});
  }
});



module.exports = router;
