"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "pengajuan_cutis", // Nama tabel
      "lamiran_keterangan", // Nama kolom lama
      "lampiran_keterangan" // Nama kolom baru
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "pengajuan_cutis", // Nama tabel
      "lampiran_keterangan", // Nama kolom baru
      "lamiran_keterangan" // Nama kolom lama
    );
  },
};
