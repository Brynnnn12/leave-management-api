const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const crypto = require("crypto");

// Konfigurasi Cloudinary dengan region yang lebih tepat
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  region: "us-east-1", // Ganti dengan region yang lebih dekat dengan pengguna atau server Anda
});

// Storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const userId = req.user?.username || "user";
    const uniqueId = crypto.randomBytes(8).toString("hex"); // Lebih ringan dari 16 byte
    return {
      folder: "leaveManagements/lampiran",
      public_id: `lampiran_${userId}_${uniqueId}`,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf"],
      resource_type: "auto", // Otomatis untuk gambar/pdf
    };
  },
});

// Filter hanya untuk file gambar/pdf
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar atau PDF yang diperbolehkan."));
  }
};

const uploadLampiran = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Maksimal 2 MB
  },
  fileFilter,
});

module.exports = {
  uploadLampiran,
};
