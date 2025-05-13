const asyncHandler = require("express-async-handler");
const { PengajuanCuti, JenisCuti, Karyawan } = require("../models");
const { pengajuanSchema } = require("../validations/pengajuanValidation");
const paginate = require("../utils/paginate");

exports.index = asyncHandler(async (req, res) => {
  const whereCondition =
    req.user?.role === "Admin" ? {} : { karyawan_id: req.user.id };

  const paginationResult = await paginate(PengajuanCuti, req.query, {
    attributes: ["id", "tanggal_mulai", "tanggal_selesai", "alasan", "status"],
    where: whereCondition,
    include: [
      {
        model: Karyawan,
        as: "karyawan",
        attributes: ["nama"],
        where: { id: req.user.id }, // Pastikan karyawan yang dimaksud adalah user yang sedang login
      },
      {
        model: JenisCuti,
        as: "jenisCuti",
        attributes: ["nama"],
      },
    ],
  });

  return res.status(200).json({
    status: "success",
    message: "Pengajuan cuti berhasil ditemukan",
    data: paginationResult.data,
    pagination: paginationResult.pagination,
  });
});

exports.store = asyncHandler(async (req, res) => {
  console.time("pengajuan_total");

  const { error } = pengajuanSchema.validate(req.body);
  if (error) {
    return res.status(422).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  console.time("find_karyawan");
  const karyawan = await Karyawan.findOne({
    where: { user_id: req.user.id },
    attributes: ["id"],
    raw: true,
  });
  console.timeEnd("find_karyawan");

  if (!karyawan) {
    return res.status(404).json({
      status: "error",
      message: "Karyawan tidak ditemukan.",
    });
  }

  const lampiranKeterangan = req.file ? req.file.path : null;

  console.time("create_pengajuan");
  const pengajuanCuti = await PengajuanCuti.create({
    jenis_cuti_id: req.body.jenis_cuti_id,
    karyawan_id: karyawan.id,
    tanggal_mulai: req.body.tanggal_mulai,
    tanggal_selesai: req.body.tanggal_selesai,
    alasan: req.body.alasan,
    lampiran_keterangan: lampiranKeterangan,
  });
  console.timeEnd("create_pengajuan");

  console.timeEnd("pengajuan_total");

  return res.status(201).json({
    status: "success",
    message: "Pengajuan cuti berhasil dibuat",
    data: pengajuanCuti,
  });
});
