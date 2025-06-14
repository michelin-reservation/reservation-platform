import { Request, Response } from 'express';
import * as favoriteService from '../services/favoriteService';

export const addFavorite = async (req: Request, res: Response) => {
  const favorite = await favoriteService.addFavorite(req.body);
  res.json(favorite);
};

export const getFavoritesByUser = async (req: Request, res: Response) => {
  const favorites = await favoriteService.getFavoritesByUser(req.params.userId);
  res.json(favorites);
};

export const deleteFavorite = async (req: Request, res: Response) => {
  await favoriteService.deleteFavorite(req.params.id);
  res.json({ message: 'Deleted' });
}; 