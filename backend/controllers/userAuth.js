const userModel = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

register = async (req, res) => {
  try {
    const { username, course, enrollment, school, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { enrollment }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8+ chars with uppercase, number & symbol",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const createUser = await userModel.create({
      username,
      course,
      enrollment,
      school,
      email,
      password: hash,
    });

    console.log(createUser);
    res.json({
      success: true,
      message: "User Registered successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const result = await bcrypt.compare(password, user.password);
    
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY);
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Login Successful.", token });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong." });
  }
};

logout = async (req, res) => {
  res.clearCookie("userToken");
  res.json({ message: "Logged out successfully " });
};

module.exports = { register, login, logout };
