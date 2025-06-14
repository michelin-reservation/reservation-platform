import { Request, Response } from 'express';
import * as restaurantService from '../services/restaurantService';

export const getAllRestaurants = async (req: Request, res: Response) => {
  const data = await restaurantService.getAllRestaurants();
  res.json(data);
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const data = await restaurantService.getRestaurantById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Restaurant not found' });
  res.json(data);
}; 