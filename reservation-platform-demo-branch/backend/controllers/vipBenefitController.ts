import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

// VIP 혜택 목록 조회
export const getVipBenefits = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // VIP 등급에 따른 혜택 설정
    const benefits = [
      {
        id: '1',
        name: '무료 발레파킹',
        description: '모든 미쉐린 레스토랑에서 발레파킹 서비스 무료 이용',
        isActive: user.userType === 'VIP',
        usedCount: 3,
        maxUses: user.userType === 'VIP' ? 10 : 0
      },
      {
        id: '2',
        name: '전용 컨시어지',
        description: '24시간 VIP 전용 컨시어지 서비스 이용',
        isActive: user.userType === 'VIP',
        usedCount: 1,
        maxUses: user.userType === 'VIP' ? 5 : 0
      },
      {
        id: '3',
        name: '특별 메뉴 제공',
        description: 'VIP 전용 특별 메뉴 및 와인 페어링 서비스',
        isActive: user.userType === 'VIP',
        usedCount: 8,
        maxUses: user.userType === 'VIP' ? 20 : 0
      },
      {
        id: '4',
        name: '우선 예약',
        description: '인기 레스토랑 우선 예약 및 확정 보장',
        isActive: user.userType === 'VIP',
        usedCount: 12,
        maxUses: user.userType === 'VIP' ? 50 : 0
      }
    ];

    res.json(benefits);
  } catch (error) {
    console.error('VIP 혜택 목록 조회 실패:', error);
    res.status(500).json({ message: 'VIP 혜택 목록 조회에 실패했습니다.' });
  }
};

// VIP 혜택 사용
export const useVipBenefit = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const benefitId = req.params.benefitId;

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.userType !== 'VIP') {
      return res.status(403).json({ message: 'VIP 회원만 혜택을 사용할 수 있습니다.' });
    }

    // TODO: 실제 혜택 사용 로직 구현
    // 현재는 성공 응답만 반환
    res.json({ message: '혜택이 성공적으로 사용되었습니다.' });
  } catch (error) {
    console.error('VIP 혜택 사용 실패:', error);
    res.status(500).json({ message: 'VIP 혜택 사용에 실패했습니다.' });
  }
}; 