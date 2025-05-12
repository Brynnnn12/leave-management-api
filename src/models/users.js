"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.belongsTo(models.Roles, {
        foreignKey: "roleId",
        as: "role",
      });
      Users.hasOne(models.Karyawan, {
        foreignKey: "user_id",
        as: "karyawan",
      });
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "roles", // Nama tabel yang benar dalam DB (huruf kecil)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      hooks: {
        // Menggunakan bcrypt untuk mengenkripsi password sebelum menyimpan ke database
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10); // Gunakan versi async
            user.password = await bcrypt.hash(user.password, salt); // Gunakan versi async
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },

        // Membuat karyawan otomatis setelah user dibuat
        afterCreate: async (user, options) => {
          const { Karyawan } = sequelize.models; // Mengakses model Karyawan
          await Karyawan.create({
            user_id: user.id, // Hanya mengisi user_id
          });
        },
      },
      sequelize,
      modelName: "Users",
      tableName: "users", // Nama tabel yang benar dalam DB (huruf kecil)
    }
  );
  Users.prototype.CorrectPassword = async (reqPassword, userPassword) => {
    return await bcrypt.compare(reqPassword, userPassword);
  };
  return Users;
};
