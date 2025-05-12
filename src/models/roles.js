"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan relasi satu Role memiliki banyak Users
      Roles.hasMany(models.Users, {
        foreignKey: "roleId", // Nama kolom foreign key di tabel Users
        as: "users", // alias yang digunakan saat eager loading
      });
    }
  }

  Roles.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // UUID otomatis
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Nama role tidak boleh null
      },
    },
    {
      sequelize,
      modelName: "Roles", // Nama model, akan digunakan dalam kode
      tableName: "roles", // Nama tabel di database (huruf kecil semua)
    }
  );

  return Roles;
};
