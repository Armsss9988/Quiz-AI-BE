import { Request, Response } from "express";
import supabase from "../configs/supabaseClient";

// 📌 Lưu Quiz của User
export const saveQuiz = async (req: Request, res: Response) => {
  const { userId, quizData } = req.body;

  const { data, error } = await supabase
    .from("quizzes")
    .insert([{ user_id: userId, quiz_data: quizData }]);

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ message: "Quiz saved successfully!" });
};

// 📌 Lấy Quiz của User
export const getUserQuizzes = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json(data);
};
