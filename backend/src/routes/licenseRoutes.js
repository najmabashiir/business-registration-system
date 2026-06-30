const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  generateLicense,
  getLicenses,
  getLicenseById,
  renewLicense,
  getMyLicenses,
  
} = require("../controllers/licenseController");

router.post(
  "/:businessId",
  protect,
  admin,
  generateLicense
);

router.get(
  "/",
  protect,
  admin,
  getLicenses
);
router.get(
  "/my-licenses",
  protect,
  getMyLicenses
);
router.get(
  "/:id",
  protect,
  admin,
  getLicenseById
);

router.put(
  "/:id/renew",
  protect,
  admin,
  renewLicense
);

module.exports = router;