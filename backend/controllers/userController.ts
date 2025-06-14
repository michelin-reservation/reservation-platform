import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUser = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.json(user);
}; 