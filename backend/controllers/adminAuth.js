const adminModel = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  // its help creating user first time to mongoDB database
  const email = req.body?.email || process.env.ADMIN_EMAIL || "admin@gmail.com";
  const password = req.body?.password || process.env.ADMIN_PASSWORD || "admin123";

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const DefaultAdmin = await adminModel.create({
      email,
      password: hash,
    });

    console.log(DefaultAdmin);
    res.json({
      success: true,
      message: "Admin Created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const result = await bcrypt.compare(password, admin.password);
    
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRETKEY);
    res.cookie("adminToken", token, {
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

const logout = async (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logged out successfully " });
};

module.exports = { register, login, logout };
