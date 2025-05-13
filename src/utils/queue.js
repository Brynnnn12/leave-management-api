const queue = require("express-queue");

// Konfigurasi express-queue
const queueMiddleware = queue({
  activeLimit: 3, // Hanya memproses 3 request bersamaan
  queuedLimit: 10, // Batas 10 request yang menunggu di antrian
});

module.exports = {
  queueMiddleware,
};
