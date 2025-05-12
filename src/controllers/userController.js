const asyncHandler = require("express-async-handler");
const { Users, Roles } = require("../models");
const { registerSchema } = require("../validations/authValidation");
const paginate = require("../utils/paginate");

exports.index = asyncHandler(async (req, res) => {
  const paginationResult = await paginate(Users, req.query, {
    attributes: ["username"],
  });

  return res.status(200).json({
    status: "success",
    message: "Users berhasil ditemukan",
    data: paginationResult.data,
    pagination: paginationResult.pagination,
  });
});

exports.store = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { username, email, password } = value;

  const [emailExists, usernameExists] = await Promise.all([
    Users.findOne({
      where: { email },
      attributes: ["email"],
    }),
    Users.findOne({
      where: { username },
      attributes: ["username"],
    }),
  ]);

  if (emailExists || usernameExists) {
    return res.status(400).json({
      status: "fail",
      message: emailExists
        ? "Email sudah terdaftar"
        : "Username sudah terdaftar",
    });
  }

  const defaultRole = await Roles.findOne({
    where: { name: "User" },
    attributes: ["id"],
  });
  if (!defaultRole) {
    return res.status(500).json({
      status: "fail",
      message: "Role default 'User' tidak ditemukan di database",
    });
  }

  const newUser = await Users.create({
    username,
    email,
    password,
    roleId: defaultRole.id,
  });

  return res.status(201).json({
    status: "success",
    message: "User berhasil ditambahkan",
    data: {
      username: newUser.username,
    },
  });
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { username, email, password, roleId } = value;
  const user = await Users.findByPk(id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User tidak ditemukan",
    });
  }

  user.username = username || user.username;
  user.email = email || user.email;

  if (roleId !== undefined) {
    user.roleId = roleId;
  }

  if (password) {
    user.password = password; // Hashing dilakukan di hook
  }

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "User berhasil diperbarui",
    data: {
      user,
    },
  });
});

exports.destroy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Users.findByPk(id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User tidak ditemukan",
    });
  }

  await user.destroy();

  return res.status(200).json({
    status: "success",
    message: "User berhasil dihapus",
    data: {
      username: user.username,
    },
  });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      status: "fail",
      message: "Password harus diisi dan minimal 6 karakter",
    });
  }

  const user = await Users.findByPk(id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User tidak ditemukan",
    });
  }

  user.password = password; // Hashing otomatis di model
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Password berhasil diperbarui",
  });
});
