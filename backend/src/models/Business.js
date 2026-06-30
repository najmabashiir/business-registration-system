const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      required: true,
    },

    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  documents: [
  {
    fileName: String,
    filePath: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    licenseStatus: {
      type: String,
      enum: ["Inactive", "Active", "Expired"],
      default: "Inactive",
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("Business", businessSchema);