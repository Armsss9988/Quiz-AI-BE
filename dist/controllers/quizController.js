"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserQuizzes = exports.saveQuiz = void 0;
const supabaseClient_1 = __importDefault(require("../configs/supabaseClient"));
// 📌 Lưu Quiz của User
const saveQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, quizData } = req.body;
    const { data, error } = yield supabaseClient_1.default
        .from("quizzes")
        .insert([{ user_id: userId, quiz_data: quizData }]);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json({ message: "Quiz saved successfully!" });
});
exports.saveQuiz = saveQuiz;
// 📌 Lấy Quiz của User
const getUserQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { data, error } = yield supabaseClient_1.default
        .from("quizzes")
        .select("*")
        .eq("user_id", userId);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json(data);
});
exports.getUserQuizzes = getUserQuizzes;
