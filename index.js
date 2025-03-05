const express = require("express");
const connectDB = require("./database/conn");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/interactions", require("./routes/interactionRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/merchants", require("./routes/merchantRoutes"));
app.use("/api/agent", require("./routes/agentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {connectDB(),console.log(`Server running on port ${PORT}`)});
