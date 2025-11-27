const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER LOGIC
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    res.status(201).json({ msg: "User created successfully!", user: savedUser._id });

  } catch (err) {
    console.log("wrong");
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN LOGIC
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT Token
    const token = jwt.sign(
      { 
        id: user._id 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: '1h' 
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { signup, login }