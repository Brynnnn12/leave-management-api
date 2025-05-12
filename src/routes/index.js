const express = require("express");
const router = express.Router();
const authRoutes = require("../routes/authRoutes");
const jabatanRoutes = require("../routes/jabatanRoutes");
const karyawanRoutes = require("../routes/karyawanRoutes");
const userRoutes = require("../routes/userRoutes");

router.use("/auth", authRoutes);
router.use("/jabatan", jabatanRoutes);
router.use("/karyawan", karyawanRoutes);
router.use("/user", userRoutes);

module.exports = router;
