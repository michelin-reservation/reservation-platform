import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token, user } = await authService.login(req.body.email, req.body.password);
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}; 