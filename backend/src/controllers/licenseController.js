const License = require("../models/License");
const Business = require("../models/Business");

const generateLicense = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    if (business.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Business must be approved first",
      });
    }

    const existingLicense = await License.findOne({
      business: business._id,
    });

    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: "License already exists",
      });
    }

    const license = await License.create({
      business: business._id,
      licenseNumber: `LIC-${Date.now()}`,
      expiryDate: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ),
    });

    business.licenseStatus = "Active";
    await business.save();

    res.status(201).json({
      success: true,
      message: "License generated successfully",
      license,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLicenses = async (req, res) => {
  try {
    const licenses = await License.find()
      .populate({
        path: "business",
        select: "businessName registrationNumber owner",
        populate: {
          path: "owner",
          select: "fullName email phone",
        },
      });

    res.status(200).json({
      success: true,
      count: licenses.length,
      licenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getLicenseById = async (req, res) => {
  try {
    const license = await License.findById(req.params.id)
      .populate({
        path: "business",
        select: "businessName registrationNumber owner",
        populate: {
          path: "owner",
          select: "fullName email phone",
        },
      });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found",
      });
    }

    res.status(200).json({
      success: true,
      license,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const renewLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found",
      });
    }

    license.expiryDate = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    );

    license.status = "Active";

    await license.save();

    res.status(200).json({
      success: true,
      message: "License renewed successfully",
      license,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyLicenses = async (req, res) => {
  try {
    const licenses = await License.find()
      .populate({
        path: "business",
        match: { owner: req.user._id },
        populate: {
          path: "owner",
          select: "fullName email",
        },
      });

    const myLicenses = licenses.filter(
      (license) => license.business !== null
    );

    res.status(200).json({
      success: true,
      count: myLicenses.length,
      licenses: myLicenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  generateLicense,
  getLicenses,
  getLicenseById,
  renewLicense,
  getMyLicenses,

};