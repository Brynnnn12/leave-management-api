const jwt = require("jsonwebtoken");

/**
 * Fungsi untuk membuat token JWT
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Token akan kedaluwarsa berdasarkan expiresIn
  });
};

/**
 * Fungsi untuk mendapatkan opsi cookie
 * Opsi ini digunakan saat mengatur cookie di response
 */
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Hanya secure di production
    sameSite: "Strict",
  };
};

/**
 * Fungsi untuk mengirim token ke client
 * Mengatur cookie di response dan mengirimkan informasi user
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id); // Membuat token dengan user ID
  const cookieOptions = getCookieOptions(); // Mendapatkan opsi cookie

  // Mengatur cookie di response dengan nama 'jwt' dan token
  res.cookie("jwt", token, cookieOptions);

  // Mengirim respons ke client dengan token dan informasi user
  res.status(statusCode).json({
    status: "success",
    message: "Berhasil login",
    token, // Mengirimkan token yang juga dapat digunakan di header Authorization
    data: {
      username: user.username,
      email: user.email, // Mengembalikan email pengguna
    },
  });
};

/**
 * Fungsi untuk memverifikasi token JWT
 * Menggunakan secret key untuk memverifikasi token
 */
const verifyToken = (token) => {
  try {
    // Memverifikasi token menggunakan secret key
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // Menangani error dan memberikan informasi yang lebih jelas
    return { error: "Token tidak valid atau sudah kedaluwarsa" };
  }
};

// Mengekspor fungsi agar bisa digunakan di file lain
module.exports = { signToken, createSendToken, verifyToken };
