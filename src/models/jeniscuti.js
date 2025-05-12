"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisCuti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JenisCuti.hasMany(models.PengajuanCuti, {
        foreignKey: "jenis_cuti_id",
        as: "pengajuanCuti",
      });
    }
  }
  JenisCuti.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
          is: /^[a-zA-Z0-9\s]+$/, // Hanya huruf, angka, dan spasi
        },
      },
      jumlah_hari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
          max: 365, // Menambahkan batas atas jika ada (misalnya maksimal 365 hari)
        },
      },
    },
    {
      sequelize,
      modelName: "JenisCuti",
      tableName: "jenis_cutis", // Nama tabel di database
    }
  );
  return JenisCuti;
};
