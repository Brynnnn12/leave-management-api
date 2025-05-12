"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password untuk admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Buat data admin di tabel Users
    const adminId = uuidv4(); // Buat UUID untuk admin
    await queryInterface.bulkInsert("Users", [
      {
        id: adminId,
        username: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        roleId: "9fe34011-d4a2-43bf-874e-78170a279de8", // Pastikan roleId ini valid di tabel Roles
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Buat data karyawan yang berelasi dengan admin
    await queryInterface.bulkInsert("Karyawans", [
      {
        id: uuidv4(),
        user_id: adminId, // Relasi dengan User
        nama: "Admin",
        alamat: "Jl. Raya No.1",
        no_telepon: "081234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Hapus data dari tabel Karyawans
    await queryInterface.bulkDelete("Karyawans", null, {});

    // Hapus data dari tabel Users
    await queryInterface.bulkDelete(
      "Users",
      {
        email: "admin@gmail.com",
      },
      {}
    );
  },
};
