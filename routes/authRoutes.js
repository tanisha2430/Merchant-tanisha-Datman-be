const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Agent = require("../models/Agent");

const router = express.Router();

//Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const checkUser=await Agent.findOne({email})
  if(checkUser){
    return res.status(402).json({ message: "Agent already registerd with this email"});
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAgent = new Agent({ username, email, password: hashedPassword });

  await newAgent.save();
  const token = jwt.sign({ _id: newAgent._id }, process.env.JWT_SECRET);
  res.json({ message: "Agent registered successfully" ,token,newAgent});
});

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  const agent = await Agent.findOne({ email });
  if (!agent) return res.status(400).json({ error: "Invalid email" });

  const isMatch = await bcrypt.compare(password, agent.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ _id: agent._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
