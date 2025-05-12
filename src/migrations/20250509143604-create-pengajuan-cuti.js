"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pengajuan_cutis", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      karyawan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "karyawans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      jenis_cuti_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "jenis_cutis",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      tanggal_selesai: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      alasan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lamiran_keterangan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "disetujui", "ditolak"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    //index
    await queryInterface.addIndex("pengajuan_cutis", ["karyawan_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pengajuan_cutis");
  },
};
