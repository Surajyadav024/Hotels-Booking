import { getRandomSixDigit } from "../middlewares/random6digit.no.js";
import sendMail from "../middlewares/sendmail.js";
import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import templateModel from "../models/template.model.js";

export const createAdmin = async (req, res) => {
  try {
    const { FirstName, LastName, Email, PhoneNo, Password, confirmPassword } =
      req.body;
    const isExistuser = await adminModel.findOne({ Email });
    if (isExistuser) {
      return res.status(400).json({ message: "Email already exist" });
    }
    if (Password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password should be same" });
    }
    const hashedpassword = await bcrypt.hash(Password, 10);
    const admin = await adminModel.create({
      FirstName,
      LastName,
      Email,
      PhoneNo,
      Password: hashedpassword,
    });

    const template = await templateModel.findOne({ name: "REGISTRATION" });
    const emailContent = template.html.replace("[User's Name]", FirstName);
    await sendMail(Email, template.subject, "", emailContent);
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }
    const user = await adminModel.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = await jwt.sign(
      { id: user._id, Email: user.Email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const template = await templateModel.findOne({ name: "LOGIN" });
    const emailContent = template.html.replace("[User's Name]", user.FirstName);
    await sendMail(Email, template.subject, "", emailContent);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) {
      return res.status(400).json({ message: "Email id is required" });
    }
    const isuserExist = await adminModel.findOne({ Email });
    if (!isuserExist) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    const otp = getRandomSixDigit();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const sendotp = await adminModel.findByIdAndUpdate(
      isuserExist._id,
      {
        otp,
        otpExpiry,
      },
      { new: true }
    );
    
    const template = await templateModel.findOne({ name: "FORGET_PASSWORD" });
    const customizedHtml = template.html.replace(`{{otp}}`, ` ${sendotp.otp}`)
    .replace("[User's Name]", isuserExist.FirstName);;
    await sendMail(Email, template.subject, "", customizedHtml);

    return res
      .status(200)
      .json({ message: "OTP sent to your email successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { Email, otp } = req.body;
    if (!Email || !otp) {
      return res.status(400).json({ message: "Invalid Payload" });
    }
    const isExistuser = await adminModel.findOne({ Email });
    if (!isExistuser) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    const currentTime = Date.now();
    if (currentTime > isExistuser.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    if (otp !== isExistuser.otp) {
      return res.status(400).json({ message: "OTP is Invalid" });
    }
    return res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const setnewPassword = async (req, res) => {
  try {
    const { Email, Password, ConfirmPassword } = req.body;
    if (!Email || !Password || !ConfirmPassword) {
      return res.status(400).json({ message: "Invalid Payload" });
    }
    const isExistuser = await adminModel.findOne({ Email });
    if (!isExistuser) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    if (Password !== ConfirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password does not match" });
    }
    const hashedpassword = await bcrypt.hash(Password, 10);
    isExistuser.Password = hashedpassword;
    await isExistuser.save();

    const template = await templateModel.findOne({ name: "RESET_NEW_PASSWORD" });
    const emailContent = template.html.replace("[User's Name]", user.FirstName);
    await sendMail(Email, template.subject, "", emailContent);

    return res.status(200).json({ message: "New password reset successfully! " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const admin = await adminModel.findById(
      adminId,
      "FirstName LastName Email PhoneNo"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { FirstName, LastName, PhoneNo, Email } = req.body;
    if (!adminId) {
      return res.status(400).json({ message: "admin ID is required" });
    }

    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      adminId,
      {
        FirstName,
        LastName,
        Email,
        PhoneNo,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find(
      {},
      "FirstName LastName Email PhoneNo"
    );

    if (!admins.length) {
      return res.status(404).json({ message: "No admins found" });
    }

    return res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.id;

    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(400).json({ message: "admin not found" });
    }
    await adminModel.findByIdAndDelete(adminId);
    return res.status(200).json({ messasge: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
