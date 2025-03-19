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
exports.refreshToken = exports.login = exports.register = void 0;
const supabaseClient_1 = __importDefault(require("../configs/supabaseClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    if (!email) {
        res.status(400).json({ error: "email not found" });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const { data, error } = yield supabaseClient_1.default
        .from("users")
        .insert([{ email, password: hashedPassword, username }]);
    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json({ message: "User registered successfully!" });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { data: users, error } = yield supabaseClient_1.default
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    if (error || !users) {
        res.status(400).json({ error: "User not found" });
        return;
    }
    const validPassword = yield bcryptjs_1.default.compare(password, users.password);
    if (!validPassword) {
        res.status(400).json({ error: "Invalid password" });
        return;
    }
    const accessToken = generateAccessToken(users);
    const refreshToken = generateRefreshToken(users);
    res.json({ accessToken, refreshToken });
});
exports.login = login;
const refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
};
exports.refreshToken = refreshToken;
