const asyncHandler = require("express-async-handler");
const { Karyawan, Jabatan } = require("../models");
const { karyawanSchema } = require("../validations/karyawanValidation");
const paginate = require("../utils/paginate");

// Fungsi untuk mendapatkan semua karyawan
exports.index = asyncHandler(async (req, res) => {
  const paginationResult = await paginate(Karyawan, req.query, {
    attributes: ["nama", "alamat", "no_telepon"],

    include: [
      {
        model: Jabatan,
        as: "jabatan",
        attributes: ["nama"],
      },
    ],
  });

  return res.status(200).json({
    status: "success",
    message: "Karyawan berhasil ditemukan",
    data: paginationResult.data,
    pagination: paginationResult.pagination,
  });
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validasi input menggunakan Joi
  const { error, value } = karyawanSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { nama, alamat, no_telepon, jabatan_id } = value;

  // Cari karyawan berdasarkan ID
  const karyawan = await Karyawan.findByPk(id);
  if (!karyawan) {
    return res.status(404).json({
      status: "fail",
      message: "Karyawan tidak ditemukan",
    });
  }

  // Update data karyawan
  karyawan.nama = nama || karyawan.nama;
  karyawan.alamat = alamat || karyawan.alamat;
  karyawan.no_telepon = no_telepon || karyawan.no_telepon;
  karyawan.jabatan_id = jabatan_id || karyawan.jabatan_id;

  // Simpan perubahan
  await karyawan.save();

  return res.status(200).json({
    status: "success",
    message: "Karyawan berhasil diperbarui",
    data: {
      karyawan,
    },
  });
});
