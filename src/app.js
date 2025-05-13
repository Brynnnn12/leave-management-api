require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes/index");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { queueMiddleware } = require("./utils/queue");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//queue
app.use(queueMiddleware);
// Middleware logging waktu eksekusi
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${
        req.originalUrl
      } - ${duration}ms`
    );
  });
  next();
});

// Routes
app.use("/api", routes);

// Error handling middleware
// Not Found & Error Handler
app.use(notFound);
app.use(errorHandler);

// Ambil PORT dari env
const PORT = process.env.PORT || 3000; // fallback ke 3000 kalau PORT di env kosong

// Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
