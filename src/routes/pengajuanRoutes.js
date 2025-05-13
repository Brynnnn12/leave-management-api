const express = require("express");
const { store, index } = require("../controllers/pengajuanController");
const { uploadLampiran } = require("../utils/fileUpload");
const { multerErrorHandler } = require("../middlewares/multerErrorHandler"); // tambahkan
const {
  authMiddleware,
  permissionMiddleware,
} = require("../middlewares/authHandler");

const router = express.Router();

// Rute untuk membuat pengajuan cuti dengan lampiran + handler error multer
router.post(
  "/",
  authMiddleware,
  permissionMiddleware("Admin"),
  uploadLampiran.single("lampiran_keterangan"),

  store,
  multerErrorHandler // ← handler khusus error dari multer
);

// Rute untuk mendapatkan daftar pengajuan cuti
router.get("/", authMiddleware, permissionMiddleware("Admin"), index);

module.exports = router;
