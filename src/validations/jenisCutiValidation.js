const joi = require("joi");

/**
 * Fungsi untuk memvalidasi data jenis cuti
 * @param {Object} req - Request object
 */
exports.jenisCutiSchema = joi.object({
  nama: joi
    .string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": '"Nama" harus berupa string',
      "string.pattern.base": '"Nama" hanya boleh berisi huruf dan spasi',
      "string.min": '"Nama" harus memiliki panjang minimal {#limit} karakter',
      "string.max": '"Nama" harus memiliki panjang maksimal {#limit} karakter',
      "any.required": '"Nama" wajib diisi',
    }),
  jumlah_hari: joi.number().integer().min(1).required().messages({
    "number.base": '"Jumlah Hari" harus berupa angka',
    "number.integer": '"Jumlah Hari" harus berupa bilangan bulat',
    "number.min": '"Jumlah Hari" harus lebih besar dari {#limit}',
    "any.required": '"Jumlah Hari" wajib diisi',
  }),
});
