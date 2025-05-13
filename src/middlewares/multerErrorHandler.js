const multer = require("multer");

/**
 * Middleware untuk menangani error dari multer
 */
exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Ukuran file maksimal adalah 2 MB." });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ error: err.message || "Tipe file tidak diizinkan." });
    }

    return res.status(400).json({ error: err.message });
  }

  // Tangani error lain (bukan dari multer)
  return res
    .status(500)
    .json({ error: err.message || "Terjadi kesalahan pada server." });
};
