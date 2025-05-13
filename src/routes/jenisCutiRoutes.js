const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/jenisCutiControlller");
const {
  authMiddleware,
  permissionMiddleware,
} = require("../middlewares/authHandler");

// Route untuk mendapatkan semua jenis cuti
router.get("/", authMiddleware, permissionMiddleware("Admin"), index);
// Route untuk menambahkan jenis cuti baru
router.post("/", authMiddleware, permissionMiddleware("Admin"), store);
// Route untuk mengupdate jenis cuti
router.put("/:id", authMiddleware, permissionMiddleware("Admin"), update);
// Route untuk menghapus jenis cuti
router.delete("/:id", authMiddleware, permissionMiddleware("Admin"), destroy);

module.exports = router;
