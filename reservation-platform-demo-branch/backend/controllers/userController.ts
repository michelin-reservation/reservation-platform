import { Request, Response } from 'express';
import * as userService from '../services/userService';
import prisma from '../utils/prismaClient';

// [from TS]
export const getUser = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.json(user);
};

// VIP 통계 조회
export const getVipStats = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // 사용자 본인 또는 관리자만 조회 가능
    if (req.user.id !== userId && req.user.role !== '관리자') {
      return res.status(403).json({ message: '조회 권한이 없습니다.' });
    }

    // 예약 통계
    const reservations = await prisma.reservation.findMany({
      where: { userId, deletedAt: null },
      include: { payment: true }
    });

    // 리뷰 통계
    const reviews = await prisma.review.findMany({
      where: { userId, deletedAt: null }
    });

    // 즐겨찾기 통계
    const favorites = await prisma.favorite.findMany({
      where: { userId, deletedAt: null }
    });

    // 사용자 정보
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // 통계 계산
    const totalReservations = reservations.length;
    const totalSpent = reservations.reduce((sum, reservation) => {
      return sum + (reservation.payment?.amount || 0);
    }, 0);
    
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const vipStats = {
      totalReservations,
      totalSpent,
      averageRating: Math.round(averageRating * 10) / 10,
      favoriteRestaurants: favorites.length,
      vipLevel: user?.userType || '일반',
      benefitsUsed: 0 // TODO: VIP 혜택 사용 통계 추가
    };

    res.json(vipStats);
  } catch (error) {
    console.error('VIP 통계 조회 실패:', error);
    res.status(500).json({ message: 'VIP 통계 조회에 실패했습니다.' });
  }
};

// VIP 예약 목록 조회
export const getVipReservations = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // 사용자 본인 또는 관리자만 조회 가능
    if (req.user.id !== userId && req.user.role !== '관리자') {
      return res.status(403).json({ message: '조회 권한이 없습니다.' });
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId, deletedAt: null },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const vipReservations = reservations.map(reservation => ({
      id: reservation.id,
      restaurantName: reservation.restaurant.name,
      date: reservation.date.toISOString().split('T')[0],
      time: reservation.time,
      people: reservation.people,
      status: reservation.status,
      priority: true // VIP 예약은 모두 우선 예약으로 처리
    }));

    res.json(vipReservations);
  } catch (error) {
    console.error('VIP 예약 목록 조회 실패:', error);
    res.status(500).json({ message: 'VIP 예약 목록 조회에 실패했습니다.' });
  }
};

// [from JS]
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, userName, userType, phone, companyName } = req.body;
    // 이메일 중복 확인
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
      userName,
      userType,
      phone,
      companyName
    });
    // 토큰 생성
    const token = jwt.sign(
      { id: newUser.id, userType: newUser.userType },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
        userType: newUser.userType
      }
    });
  } catch (error: any) {
    console.error('회원가입 에러:', error);
    res.status(500).json({
      success: false,
      message: error.message || '회원가입 중 오류가 발생했습니다.'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        userType: user.userType
      }
    });
  } catch (error: any) {
    console.error('로그인 에러:', error);
    res.status(500).json({
      success: false,
      message: error.message || '로그인 중 오류가 발생했습니다.'
    });
  }
};

export const getProfile = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userService.getUserById(req.user.user_id);
    if (!user) return res.status(404).json({ code: 'NOT_FOUND', message: '사용자를 찾을 수 없습니다.' });
    res.json({ code: 'SUCCESS', data: user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: any) => {
  try {
    const user = await userService.updateUserProfile(req.user.user_id, req.body);
    res.json({ code: 'SUCCESS', data: user });
  } catch (err) {
    next(err);
  }
};

export const getNotificationSettings = async (req: Request, res: Response, next: any) => {
  try {
    const settings = await userService.getNotificationSettings(req.user.user_id);
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

export const updateNotificationSettings = async (req: Request, res: Response, next: any) => {
  try {
    const settings = await userService.updateNotificationSettings(req.user.user_id, req.body);
    res.json({ message: '알림 설정이 업데이트되었습니다.', settings });
  } catch (err) {
    next(err);
  }
};
