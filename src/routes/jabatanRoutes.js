const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/jabatanController");

// Route untuk mendapatkan semua jabatan
router.get("/", index);
// Route untuk menambahkan jabatan baru
router.post("/", store);
// Route  untuk update jabatan
router.put("/:id", update);
// Route untuk menghapus jabatan
router.delete("/:id", destroy);

module.exports = router;
