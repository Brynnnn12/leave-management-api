// Middleware untuk menangani route yang tidak ditemukan
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware untuk menangani error
exports.errorHandler = (err, req, res, next) => {
  // Jika status tidak diatur, gunakan status 500 (Internal Server Error)
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Pesan error default
  let message = err.message || "Something went wrong";

  // Tangani error validasi Sequelize
  if (err.errors && err.name === "SequelizeValidationError") {
    const errorList = err.errors.map((error) => ({
      [error.path]: error.message,
    }));
    message = errorList;
    statusCode = 400; // Bad Request
  }

  // Kirim respons error
  res.status(statusCode).json({
    status: "error",
    message,
    // Tampilkan stack trace hanya jika dalam mode pengembangan
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
