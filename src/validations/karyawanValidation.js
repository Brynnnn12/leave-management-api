const Joi = require("joi");

exports.karyawanSchema = Joi.object({
  nama: Joi.string().min(3).max(50).optional().messages({
    "string.base": "Nama harus berupa string",
    "string.min": "Nama harus memiliki panjang minimal {#limit} karakter",
    "string.max": "Nama harus memiliki panjang maksimal {#limit} karakter",
  }),
  alamat: Joi.string().max(255).optional().messages({
    "string.base": "Alamat harus berupa string",
    "string.max": "Alamat harus memiliki panjang maksimal {#limit} karakter",
  }),
  no_telepon: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(14)
    .optional()
    .messages({
      "string.base": "No telepon harus berupa string",
      "string.pattern.base": "No telepon hanya boleh berisi angka",
      "string.min":
        "No telepon harus memiliki panjang minimal {#limit} karakter",
      "string.max":
        "No telepon harus memiliki panjang maksimal {#limit} karakter",
    }),
  jabatan_id: Joi.string().uuid().optional().messages({
    "string.base": "Jabatan ID harus berupa string",
    "string.guid": "Jabatan ID harus berupa UUID yang valid",
  }),
});
