import templateModel from "../models/template.model.js";
export const createTemplate = async (req, res) => {
  try {
    const { name, subject, html } = req.body;
    if (!name || !subject || !html) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const newTemplate = await templateModel.create({
      name,
      subject,
      html,
    });
    res
      .status(201)
      .json({ message: "Template created successfully", newTemplate });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating in template", error: error.message });
  }
};
export const getTemplateById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Template id is required" });
    }
    const template = await templateModel.findById(id);
    return res.status(200).json({ template });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting template", error: error.message });
  }
};
export const getTemplateByName = async (req, res) => {
  try {
    const name = req.params.name;
    if (!name) {
      return res.status(400).json({ message: "Template name is required" });
    }
    const template = await templateModel.findOne({ name });
    return res.status(200).json({ template });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting template", error: error.message });
  }
};
export const updateTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, subject, html } = req.body;
    if (!id || !name || !subject || !html) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const template = await templateModel.findByIdAndUpdate(
      id,
      { name, subject, html },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json({ message: "Update successfully", template });
  } catch (error) {
    return res.status(500).json({ message: "Falied to update template" });
  }
};
export const deleteTemplate = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Template id is required" });
    }
    const template = await templateModel.findByIdAndDelete(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json({ message: "Template delete Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Falied to delete template" });
  }
};
