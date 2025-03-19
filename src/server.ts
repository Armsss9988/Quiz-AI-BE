import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
