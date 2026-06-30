const Business = require("../models/Business");
const License = require("../models/License");



// CREATE BUSINESS
const createBusiness = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      address,
      phone,
      email,
    } = req.body;

    // Prevent duplicate business names
    const existingBusiness = await Business.findOne({
      businessName: {
        $regex: new RegExp(
          `^${businessName.trim()}$`,
          "i"
        ),
      },
    });

    if (existingBusiness) {
      return res.status(400).json({
        success: false,
        message: "Business already registered",
      });
    }

    // Generate registration number
    const lastBusiness = await Business.findOne()
      .sort({ createdAt: -1 });

    let registrationNumber = "REG-001";

    if (lastBusiness) {
      const lastNumber = Number(
        lastBusiness.registrationNumber.replace(
          "REG-",
          ""
        )
      );

      registrationNumber = `REG-${String(
        lastNumber + 1
      ).padStart(3, "0")}`;
    }

    const business = await Business.create({
      businessName,
      businessType,
      registrationNumber,
      address,
      phone,
      email,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL BUSINESSES
const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate("owner", "fullName email");

    res.status(200).json({
      success: true,
      count: businesses.length,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY BUSINESSES
const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({
      owner: req.user._id,
    });

    res.status(200).json({
      success: true,
      count: businesses.length,
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE BUSINESS
const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate("owner", "fullName email");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE BUSINESS
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE BUSINESS
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(
      req.params.id
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const approveBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    business.status = "Approved";
    business.licenseStatus = "Inactive";

    await business.save();

    res.status(200).json({
      success: true,
      message: "Business approved successfully",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectBusiness = async (req, res) => {
  try {
    const business =
      await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    business.status = "Rejected";
    business.licenseStatus = "Inactive";

    await business.save();

    res.status(200).json({
      success: true,
      message: "Business rejected",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    business.documents.push({
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    await business.save();

    res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      file: req.file.filename,
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// OWNER: UPDATE OWN BUSINESS
const updateMyBusiness = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      address,
      phone,
      email,
    } = req.body;

    const business = await Business.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found or you are not allowed to update it",
      });
    }

    if (businessName) business.businessName = businessName;
    if (businessType) business.businessType = businessType;
    if (address) business.address = address;
    if (phone) business.phone = phone;
    if (email) business.email = email;

    await business.save();

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// OWNER: DELETE OWN BUSINESS
const deleteMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found or you are not allowed to delete it",
      });
    }

    // Delete related license if it exists
    await License.deleteMany({
      business: business._id,
    });

    // Delete business
    await Business.findByIdAndDelete(business._id);

    res.status(200).json({
      success: true,
      message: "Business and related license deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBusiness,
  getBusinesses,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  approveBusiness,
  rejectBusiness,
  uploadDocument,
  updateMyBusiness,
  deleteMyBusiness,
};