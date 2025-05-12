"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PengajuanCuti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PengajuanCuti.belongsTo(models.Karyawan, {
        foreignKey: "karyawan_id",
        as: "karyawan",
      });
      PengajuanCuti.belongsTo(models.JenisCuti, {
        foreignKey: "jenis_cuti_id",
        as: "jenisCuti",
      });
    }
  }
  PengajuanCuti.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      karyawan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "karyawans",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      jenis_cuti_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "jenis_cutis",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tanggal_mulai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "Tanggal mulai harus berupa tanggal yang valid" },
          isAfter: {
            args: [new Date().toISOString().split("T")[0]],
            msg: "Tanggal mulai harus setelah tanggal hari ini",
          },
        },
      },
      tanggal_selesai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "Tanggal selesai harus berupa tanggal yang valid" },
          isAfterTanggalMulai() {
            if (
              this.tanggal_mulai &&
              this.tanggal_selesai <= this.tanggal_mulai
            ) {
              throw new Error("Tanggal selesai harus setelah tanggal mulai");
            }
          },
        },
      },
      alasan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [10, 255],
            msg: "Alasan harus antara 10 dan 255 karakter",
          },
        },
      },
      lampiran_keterangan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status_pengajuan: {
        type: DataTypes.ENUM("pending", "disetujui", "ditolak"),
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["pending", "disetujui", "ditolak"]],
            msg: "Status pengajuan harus salah satu dari pending, disetujui, atau ditolak",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "PengajuanCuti",
      tableName: "pengajuan_cutis",
    }
  );
  return PengajuanCuti;
};
