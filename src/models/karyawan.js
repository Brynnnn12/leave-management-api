"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Karyawan.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user",
      });
      Karyawan.belongsTo(models.Jabatan, {
        foreignKey: "jabatan_id",
        as: "jabatan",
      });
      Karyawan.hasMany(models.PengajuanCuti, {
        foreignKey: "karyawan_id",
        as: "pengajuanCuti",
      });
    }
  }
  Karyawan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nama: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      jabatan_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "jabatans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      no_telepon: {
        type: DataTypes.STRING(14),
        allowNull: true,
        validate: {
          is: /^[0-9]+$/,
          len: [10, 14],
        },
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Karyawan",
      tableName: "karyawans",
    }
  );
  return Karyawan;
};
