const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please provide your first name"]
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please provide your last name"]
  },
  userName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please Enter a valid Email");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password" || "password123")) {
        throw new Error("password or password123 are not valid");
      }
    },
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid login");
  }

  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.token;

  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  const salt = await bcrypt.genSalt();

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  await user.save();
  return token;
};

//virtual relationship between user model and project model

userSchema.virtual("projects", {
  ref: "Projects",
  localField: "_id",
  foreignField: "projectOwner",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
