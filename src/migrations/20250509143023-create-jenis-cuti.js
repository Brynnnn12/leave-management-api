"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jenis_cutis", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nama: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      jumlah_hari: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.addIndex("jenis_cutis", ["nama"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jenis_cutis");
  },
};
