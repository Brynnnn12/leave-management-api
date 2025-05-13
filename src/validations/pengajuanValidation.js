const joi = require("joi");
const { date } = require("joi");

/**
 * Fungsi untuk memvalidasi data pengajuan
 * @param {Object} req - Request object
 */

exports.pengajuanSchema = joi.object({
  jenis_cuti_id: joi.string().required().messages({
    "string.empty": "Jenis cuti tidak boleh kosong",
    "any.required": "Jenis cuti tidak boleh kosong",
  }),
  tanggal_mulai: joi.date().required().messages({
    "date.base": "Tanggal mulai harus berupa tanggal yang valid",
    "any.required": "Tanggal mulai tidak boleh kosong",
  }),
  tanggal_selesai: joi.date().required().messages({
    "date.base": "Tanggal selesai harus berupa tanggal yang valid",
    "any.required": "Tanggal selesai tidak boleh kosong",
  }),
  alasan: joi.string().min(10).max(255).required().messages({
    "string.empty": "Alasan tidak boleh kosong",
    "string.min": "Alasan harus antara 10 dan 255 karakter",
    "string.max": "Alasan harus antara 10 dan 255 karakter",
    "any.required": "Alasan tidak boleh kosong",
  }),
});
