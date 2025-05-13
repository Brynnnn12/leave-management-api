const jwt = require("jsonwebtoken");
const { Users, Roles } = require("../models");

/**
 * Middleware untuk memeriksa apakah pengguna sudah terautentikasi
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Ambil token dari header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Jika token tidak ditemukan
    if (!token) {
      return res.status(401).json({
        status: "401",
        message: "Anda belum login, silakan login terlebih dahulu",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil user berdasarkan ID dalam token dan relasi role-nya
    const currentUser = await Users.findByPk(decoded.id, {
      include: [{ model: Roles, as: "role", attributes: ["name"] }],
    });

    if (!currentUser) {
      return res.status(401).json({
        status: "401",
        message: "User tidak ditemukan",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "401",
      message: "Token tidak valid atau sudah kedaluwarsa",
    });
  }
};

/**
 * Middleware untuk memeriksa apakah pengguna memiliki izin akses tertentu
 * @param {...string} roles - Daftar role yang diizinkan
 * @returns {Function} Middleware function
 */
exports.permissionMiddleware = (...roles) => {
  return (req, res, next) => {
    // Pastikan req.user tersedia
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        status: "403",
        message: "Anda tidak memiliki akses",
      });
    }

    const rolesName = req.user.role.name;

    // Periksa apakah role pengguna termasuk dalam daftar role yang diizinkan
    if (!roles.includes(rolesName)) {
      return res.status(403).json({
        status: "403",
        message: "Anda tidak memiliki akses",
      });
    }

    next();
  };
};
