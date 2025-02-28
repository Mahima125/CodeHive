const Code = require("../models/code");

const code = async (req, res) => {
    try {
      const { language, code, questionId } = req.body;
      const savedCode = new Code({ language, code, questionId });
      await savedCode.save();
      res.json({ message: "Code saved successfully", success: true });
    } catch (error) {
      res.status(500).json({ message: "Error saving code", success: false });
    }
  };

module.exports={code};
  