const joi = require("joi");

/**
 * Fungsi untuk memvalidasi data jabatan
 * @param {Object} req - Request object
 */
exports.jabatanSchema = joi.object({
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
});
