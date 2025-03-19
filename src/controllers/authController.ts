import { Request, Response } from "express";
import supabase from "../configs/supabaseClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user: any): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  if (!email) {
    res.status(400).json({ error: "email not found" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword, username }]);

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ message: "User registered successfully!" });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !users) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  const validPassword = await bcrypt.compare(password, users.password);
  if (!validPassword) {
    res.status(400).json({ error: "Invalid password" });
    return;
  }

  const accessToken = generateAccessToken(users);
  const refreshToken = generateRefreshToken(users);

  res.json({ accessToken, refreshToken });
};

export const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    }
  );
};
