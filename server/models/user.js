const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Get the JWT secret from the environment
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Method to generate the JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    JWT_SECRET, // Use the secret key from .env
    { expiresIn: '1h' }
  );
  return token;
};

// Validation schema for user input
const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(data);
};

const User = mongoose.model('User', userSchema);

module.exports = { User, validate };
