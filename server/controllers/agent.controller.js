import AgentModel from "../models/agent.model.js";
import bcrypt from "bcrypt";
export const createagent = async (req, res) => {
  try {
    const { name, email, phoneNo, password, companyName, address, license } =
      req.body;
    if (
      !name ||
      !email ||
      !phoneNo ||
      !password ||
      !companyName ||
      !address ||
      !license
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const isagentExist = await AgentModel.findOne({ email });
    if (isagentExist) {
      return res.status(400).json({ message: "Agent already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = await AgentModel.create({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      companyName,
      license,
      address,
    });
     const template = await templateModel.findOne({ name: "REGISTRATION" });
     const emailContent = template.html.replace("[User's Name]", FirstName);
     await sendMail(Email, template.subject, "", emailContent);

    return res
      .status(201)
      .json({ message: "Agent created successfully", newAgent });
  } catch (error) {
    return res.status(500).json({ message: "Error creating agent", error });
  }
};
export const getAllAgents = async (req, res) => {
  try {
    const agents = await AgentModel.find();
    return res
      .status(200)
      .json({ message: "Agents fetched successfully", agents });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching agents", error });
  }
};
export const getAgentById = async (req, res) => {
  try {
    const id = req.para.id;
    if (!id) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const agent = await AgentModel.findById(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    return res
      .status(200)
      .json({ message: "Agent fetched Successfully", agent });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching agent", error });
  }
};
export const updateAgent = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Agent id is required" });
    }
    const { name, email, phoneNo, companyName, address, license } = req.body;
    const updateAgent = await AgentModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phoneNo,
        companyName,
        address,
        license,
      },
      { new: true }
    );
    if (!updateAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    return res
      .status(200)
      .json({ message: "Agent updated successfully", updateAgent });
  } catch (error) {
    return res.status(500).json({ message: "Error updating agent", error });
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
    const user = await AgentModel.findOne({ Email });
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
export const deleteAgent = async (req, res, next) => {
  try {
    const adminId = req.params.id;

    const admin = await AgentModel.findById(adminId);

    if (!admin) {
      return res.status(400).json({ message: "admin not found" });
    }
    await adminModel.findByIdAndDelete(AgentId);
    return res.status(200).json({ messasge: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
