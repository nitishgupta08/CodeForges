const express = require("express");
const router = express.Router();
const {
  getSpaces,
  createSpaces,
  updateSpaceData,
  deleteSpace,
  getSpaceData,
} = require("../controllers/spaceController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getSpaces);
router.post("/", auth, createSpaces);
router.get("/:id", auth, getSpaceData);
router.put("/:id", auth, updateSpaceData);
router.delete("/:id", auth, deleteSpace);

module.exports = router;
