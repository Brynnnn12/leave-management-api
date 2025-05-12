const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
  updatePassword,
} = require("../controllers/userController");
const {
  authMiddleware,
  permissionMiddleware,
} = require("../middlewares/authHandler");

// Route untuk mendapatkan daftar pengguna
router.get("/", authMiddleware, permissionMiddleware("Admin"), index);

// Route untuk menambahkan pengguna baru
router.post("/", authMiddleware, permissionMiddleware("Admin"), store);

// Route untuk mengupdate pengguna berdasarkan ID
router.put("/:id", authMiddleware, permissionMiddleware("Admin"), update);
// Route untuk menghapus pengguna berdasarkan ID
router.delete("/:id", authMiddleware, permissionMiddleware("Admin"), destroy);
// Route untuk mengupdate password pengguna berdasarkan ID
router.put(
  "/:id/password",
  authMiddleware,
  permissionMiddleware("Admin" || "User"),
  updatePassword
);

module.exports = router;
