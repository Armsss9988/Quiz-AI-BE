import express from "express";
import { saveQuiz, getUserQuizzes } from "../controllers/quizController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/save", authenticateToken, saveQuiz);
router.get("/:userId", authenticateToken, getUserQuizzes);

export default router;
