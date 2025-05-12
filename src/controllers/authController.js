const asyncHandler = require("express-async-handler");
const { Users, Roles } = require("../models");
const { createSendToken } = require("../utils/jwtUtils");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

/**
 * Fungsi untuk mendaftar pengguna baru
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */

exports.register = asyncHandler(async (req, res) => {
  // Validasi data pendaftaran
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }
  const { username, email, password } = value;

  // Cek apakah pengguna sudah ada
  const [existingUser, existingUsername, userRole] = await Promise.all([
    Users.findOne({ attributes: ["id"], where: { email } }),
    Users.findOne({ attributes: ["id"], where: { username } }),
    Roles.findOne({ attributes: ["id"], where: { name: "User" } }),
  ]);

  if (existingUser) {
    return res.status(400).json({
      status: "fail",
      message: "Pengguna sudah terdaftar",
    });
  }

  if (existingUsername) {
    return res.status(400).json({
      status: "fail",
      message: "Username sudah terdaftar",
    });
  }

  if (!userRole) {
    return res.status(500).json({
      status: "fail",
      message: "Role default 'User' tidak ditemukan.",
    });
  }
  // Buat pengguna baru
  const newUser = await Users.create({
    username,
    email,
    password,
    roleId: userRole.id, // Menggunakan ID dari role yang ditemukan
  });

  // Kirim token ke pengguna
  createSendToken(newUser, 201, res);
});
/**
 * Fungsi untuk login pengguna
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.login = asyncHandler(async (req, res) => {
  // ✅ Validasi request body pakai Joi
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message, // Ambil pesan error pertama
    });
  }

  // ✅ Destructuring dari value yang sudah tervalidasi
  const { email, password } = value;

  // Cek apakah user ada
  const userLogin = await Users.findOne({ where: { email } });

  if (
    !userLogin ||
    !(await userLogin.CorrectPassword(password, userLogin.password))
  ) {
    return res
      .status(401)
      .json({ status: "fail", message: "Email atau password salah" });
  }

  return createSendToken(userLogin, 200, res);
});
/**
/**
 * Fungsi untuk logout pengguna
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.logout = asyncHandler(async (req, res) => {
  // Menghapus cookie jwt secara eksplisit
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  // Mengirim respons sukses
  res.status(200).json({
    status: "success",
    message: "Berhasil logout",
  });
});

/**
 * Fungsi untuk mendapatkan informasi pengguna yang sedang login
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getMe = asyncHandler(async (req, res) => {
  // Mengambil informasi pengguna dari request
  const user = req.user;

  // Mengirim respons dengan informasi pengguna
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
