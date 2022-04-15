const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);
const asyncHandler = require(`express-async-handler`);
const User = require(`../models/userModel`);
const { response } = require("express");

// @desc    Register new user
// @route   POST /api/user
// @acess   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error(`Pleaser add all fields`);
  }

  //checking if the users exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error(`User already exists`);
  }

  //Hashing the password if the user does not already exist, salt is needed to hash password
  const salt = await bcrypt.genSalt(10);
  //create variable then await on brypt to hash, hash takes in two parameters, the original password variable and salt that was created.
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error(`Invalid user data`);
  }
});

// @desc    Authenticate user
// @route   POST /api/login
// @acess   Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //checking for user email
  const user = await User.findOne({ email });

  //if user from above with email exists we use bcrypt compare to compare the password and return the user
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error(`Invalid credentials`);
  }
});

// @desc    Get user data
// @route   GET /api/me
// @acess   Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

//Generating JWT webtoken
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
