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

    const template = await templateModel.findOne({ name: "Registration" });
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
    //const htmlcontent = `<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Forgot Password</title></head><body style='margin:0;padding:0;background-color:#f7f7f7;font-family:Arial,sans-serif'><div style='max-width:600px;margin:20px auto;background-color:#fff;border-radius:10px;box-shadow:0 2px 15px rgba(0,0,0,.1);overflow:hidden'><div style='padding:30px;text-align:center;background-color:#007bff;color:#fff'><h2 style='margin:0;font-size:24px'>Forgot Password</h2></div><div style='padding:20px;text-align:left'><p style='color:#555;font-size:16px'>Dear ${isuserExist.FirstName},</p><p style='color:#555;font-size:16px'>Your One-Time Password (OTP) for resetting your password is:</p><h3 style='color:#007bff;font-size:28px;font-weight:700;margin:20px 0;padding:10px;border:2px dashed #007BFF;display:inline-block'>${otp}</h3><p style='color:#555;font-size:16px'>Please enter this OTP.</p><p style='color:#555;font-size:16px'>This OTP is valid for the next <strong style='color:red'>5 minutes</strong>.</p><p style='color:#555;font-size:16px'>If you did not request this, please ignore this email.</p></div><div style='padding:20px;text-align:center;background-color:#f0f0f0;color:#777'><p style='margin:0;font-size:14px'>Thank you for using our service!</p><p style='margin:5px 0 0;font-size:12px'>If you have any questions, feel free to <a href='#' style='color:#007bff;text-decoration:none'>contact us</a>.</p></div></div></body></html>`;
    const template = await templateModel.findOne({ name: "OTP Verification" });
    const customizedHtml = template.html
      .replace("[OTP]", otp)
      .replace("[User's Name]", isuserExist.FirstName);

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
    return res
      .status(200)
      .json({ message: "New password reset successfully! " });
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
