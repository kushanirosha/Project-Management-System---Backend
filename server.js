const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const kanbanRoutes = require("./routes/kanbanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./routes/auth");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", kanbanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/projects", chatRoutes); 
app.use("/api/auth", authRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
