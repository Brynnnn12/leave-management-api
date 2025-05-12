const express = require("express");
const router = express.Router();
const { update, index } = require("../controllers/karyawanController");
const {
  authMiddleware,
  permissionMiddleware,
} = require("../middlewares/authHandler");

// Route untuk mengupdate data karyawan
router.put("/:id", authMiddleware, update);
// Route untuk mendapatkan semua karyawan
router.get("/", authMiddleware, permissionMiddleware("Admin"), index);

module.exports = router;
