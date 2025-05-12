const joi = require("joi");

/**
 * Fungsi untuk memvalidasi data pendaftaran
 * @param {Object} req - Request object
 */
exports.registerSchema = joi.object({
  username: joi.string().min(3).max(30).required().messages({
    "string.base": '"Username" harus berupa string',
    "string.min": '"Username" harus memiliki panjang minimal {#limit} karakter',
    "string.max":
      '"Username" harus memiliki panjang maksimal {#limit} karakter',
    "any.required": '"Username" wajib diisi',
  }),
  email: joi.string().email().required().messages({
    "string.base": '"Email" harus berupa string',
    "string.email": '"Email" harus dalam format yang valid',
    "any.required": '"Email" wajib diisi',
  }),
  password: joi.string().min(8).max(20).required().messages({
    "string.base": '"Password" harus berupa string',
    "string.min": '"Password" harus memiliki panjang minimal {#limit} karakter',
    "string.max":
      '"Password" harus memiliki panjang maksimal {#limit} karakter',
    "any.required": '"Password" wajib diisi',
  }),
});

/**
 * Fungsi untuk memvalidasi data login
 * @param {Object} req - Request object
 */
exports.loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.base": '"Email" harus berupa string',
    "string.email": '"Email" harus dalam format yang valid',
    "any.required": '"Email" wajib diisi',
  }),
  password: joi.string().min(8).max(20).required().messages({
    "string.base": '"Password" harus berupa string',
    "string.min": '"Password" harus memiliki panjang minimal {#limit} karakter',
    "string.max":
      '"Password" harus memiliki panjang maksimal {#limit} karakter',
    "any.required": '"Password" wajib diisi',
  }),
});
