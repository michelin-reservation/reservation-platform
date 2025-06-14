import prisma from '../utils/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const register = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      userType: data.userType || UserType.일반,
    }
  });
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid password');

  const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user };
};

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET); 