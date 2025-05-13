const asyncHandler = require("express-async-handler");
const { JenisCuti } = require("../models");
const { jenisCutiSchema } = require("../validations/jenisCutiValidation");
const paginate = require("../utils/paginate");

// Fungsi untuk mendapatkan semua jenis cuti
exports.index = asyncHandler(async (req, res) => {
  const paginationResult = await paginate(JenisCuti, req.query, {
    attributes: ["id", "nama", "jumlah_hari"],
  });

  return res.status(200).json({
    status: "success",
    message: "Jenis cuti berhasil ditemukan",
    data: paginationResult.data,
    pagination: paginationResult.pagination,
  });
});

// Fungsi untuk membuat jenis cuti baru
exports.store = asyncHandler(async (req, res) => {
  // Validasi input menggunakan Joi
  const { error, value } = jenisCutiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { nama, jumlah_hari } = value;

  // Cek apakah jenis cuti sudah ada
  const existingJenisCuti = await JenisCuti.findOne({
    where: { nama },
    attributes: ["nama"],
  });
  if (existingJenisCuti) {
    return res.status(409).json({
      status: "fail",
      message: "Jenis cuti sudah ada",
    });
  }

  // Buat jenis cuti baru
  const jenisCuti = await JenisCuti.create({ nama, jumlah_hari });

  return res.status(201).json({
    status: "success",
    message: "Jenis cuti berhasil dibuat",
    data: {
      nama: jenisCuti.nama,
      jumlah_hari: jenisCuti.jumlah_hari,
    },
  });
});
// Fungsi untuk mengupdate jenis cuti
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validasi input menggunakan Joi
  const { error, value } = jenisCutiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { nama, jumlah_hari } = value;

  // Cari jenis cuti berdasarkan ID
  const jenisCuti = await JenisCuti.findByPk(id);
  if (!jenisCuti) {
    return res.status(404).json({
      status: "fail",
      message: "Jenis cuti tidak ditemukan",
    });
  }

  // Update data jenis cuti
  await jenisCuti.update({ nama, jumlah_hari });

  return res.status(200).json({
    status: "success",
    message: "Jenis cuti berhasil diperbarui",
    data: {
      nama: jenisCuti.nama,
      jumlah_hari: jenisCuti.jumlah_hari,
    },
  });
});
// Fungsi untuk menghapus jenis cuti
exports.destroy = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Cari jenis cuti berdasarkan ID
  const jenisCuti = await JenisCuti.findByPk(id);
  if (!jenisCuti) {
    return res.status(404).json({
      status: "fail",
      message: "Jenis cuti tidak ditemukan",
    });
  }

  // Hapus jenis cuti
  await jenisCuti.destroy();

  return res.status(200).json({
    status: "success",
    message: "Jenis cuti berhasil dihapus",
  });
});
