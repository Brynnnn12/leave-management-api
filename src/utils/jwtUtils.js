const jwt = require("jsonwebtoken");

/**
 * Konversi waktu JWT_EXPIRES_IN (misal: 4h, 2d) menjadi milidetik
 */
const jwtExpiryToMs = (expiresIn) => {
  const match = expiresIn.match(/^(\d+)([smhd])$/); // 60s, 10m, 4h, 7d
  if (!match) return 0;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[unit];
};

/**
 * Fungsi untuk membuat token JWT
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Contoh: "4h", "1d"
  });
};

/**
 * Opsi cookie untuk menyimpan token JWT di browser
 */
const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: jwtExpiryToMs(process.env.JWT_EXPIRES_IN), // Tambahan penting
  };
};

/**
 * Fungsi untuk mengirim token JWT ke client
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id); // Buat token
  const cookieOptions = getCookieOptions(); // Ambil opsi cookie

  // Simpan token ke cookie
  res.cookie("jwt", token, cookieOptions);

  // Kirim response ke client
  res.status(statusCode).json({
    status: "success",
    message: "Berhasil login",
    token, // Masih dikirim juga untuk frontend SPA (opsional)
    data: {
      username: user.username,
      email: user.email,
    },
  });
};

/**
 * Verifikasi token JWT dari client
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return { error: "Token tidak valid atau sudah kedaluwarsa" };
  }
};

module.exports = { signToken, createSendToken, verifyToken };
