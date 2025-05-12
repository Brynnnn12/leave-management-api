const asyncHandler = require("express-async-handler");
const { Jabatan } = require("../models");
const { Op } = require("sequelize");
const { jabatanSchema } = require("../validations/jabatanValidation");
const paginate = require("../utils/paginate");

/**
 * Fungsi untuk menambahkan jabatan baru
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.store = asyncHandler(async (req, res) => {
  // Validasi data jabatan
  const { error, value } = jabatanSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }
  const { nama } = value;

  // Cek apakah jabatan sudah ada
  const existingJabatan = await Jabatan.findOne({
    where: { nama },
    attributes: ["nama"],
  });

  if (existingJabatan) {
    return res.status(400).json({
      status: "fail",
      message: "Jabatan sudah terdaftar",
    });
  }

  // Buat jabatan baru
  const newJabatan = await Jabatan.create({ nama });

  return res.status(201).json({
    status: "success",
    message: "Jabatan berhasil ditambahkan",
    data: {
      jabatan: newJabatan.nama,
    },
  });
});
/**
 * Fungsi untuk mendapatkan semua jabatan
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.index = asyncHandler(async (req, res) => {
  const paginationResult = await paginate(Jabatan, req.query);

  return res.status(200).json({
    status: "success",
    message: "Jabatan berhasil ditemukan",
    data: paginationResult.data,
    pagination: paginationResult.pagination,
  });
});

/**
 * fungsi untuk mengupdate jabatan
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */

/**
 * Fungsi untuk mengupdate jabatan berdasarkan ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validasi data jabatan
  const { error, value } = jabatanSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { nama } = value;

  // Cek apakah jabatan dengan ID tersebut ada
  const jabatan = await Jabatan.findByPk(id);
  if (!jabatan) {
    return res.status(404).json({
      status: "fail",
      message: "Jabatan tidak ditemukan",
    });
  }

  // Cek apakah nama jabatan sudah digunakan oleh jabatan lain
  const existingJabatan = await Jabatan.findOne({
    where: { nama, id: { [Op.ne]: id } },
  });

  if (existingJabatan) {
    return res.status(400).json({
      status: "fail",
      message: "Nama jabatan sudah digunakan",
    });
  }

  // Update jabatan
  jabatan.nama = nama;
  await jabatan.save();

  return res.status(200).json({
    status: "success",
    message: "Jabatan berhasil diupdate",
    data: {
      jabatan: jabatan.nama,
    },
  });
});

/**
 * Fungsi untuk menghapus jabatan berdasarkan ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.destroy = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Cek apakah jabatan dengan ID tersebut ada
  const jabatan = await Jabatan.findByPk(id);
  if (!jabatan) {
    return res.status(404).json({
      status: "fail",
      message: "Jabatan tidak ditemukan",
    });
  }

  // Hapus jabatan
  await jabatan.destroy();

  return res.status(204).json({
    status: "success",
    message: "Jabatan berhasil dihapus",
  });
});
