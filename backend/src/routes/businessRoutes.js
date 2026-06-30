const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
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
} = require("../controllers/businessController");

// Owner
router.post("/", protect, createBusiness);
router.get("/my-businesses", protect, getMyBusinesses);

router.put("/my-businesses/:id", protect, updateMyBusiness);
router.delete("/my-businesses/:id", protect, deleteMyBusiness);

router.post(
  "/upload/:id",
  protect,
  upload.single("document"),
  uploadDocument
);


// Admin
router.get("/", protect, admin, getBusinesses);

router.put("/:id/approve", protect, admin, approveBusiness);
router.put("/:id/reject", protect, admin, rejectBusiness);

router.get("/:id", protect, admin, getBusinessById);
router.put("/:id", protect, admin, updateBusiness);
router.delete("/:id", protect, admin, deleteBusiness);



module.exports = router;