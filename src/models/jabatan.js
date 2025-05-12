"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Jabatan.hasMany(models.Karyawan, {
        foreignKey: "jabatan_id",
        as: "karyawan",
      });
    }
  }
  Jabatan.init(
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
          len: [1, 50],
          is: /^[a-zA-Z0-9\s]+$/, // Hanya huruf, angka, dan spasi
        },
      },
    },
    {
      sequelize,
      modelName: "Jabatan",
      tableName: "jabatans", // Nama tabel di database
    }
  );
  return Jabatan;
};
