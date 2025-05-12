"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Karyawans", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      jabatan_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "jabatans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      no_telepon: {
        type: Sequelize.STRING(14),
        allowNull: true,
        validate: {
          is: /^[0-9]+$/,
          len: [10, 14],
        },
      },
      alamat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("aktif", "tidak aktif"),
        allowNull: false,
        defaultValue: "aktif",
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
    // Menambahkan index pada kolom yang sering digunakan untuk query
    await queryInterface.addIndex("Karyawans", ["nama"]);
    await queryInterface.addIndex("Karyawans", ["no_telepon"]);
    await queryInterface.addIndex("Karyawans", ["status"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Karyawans");
  },
};
