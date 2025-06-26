import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

// VIP 컨시어지 요청
export const requestConcierge = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { type, description, preferredDate } = req.body;

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.userType !== 'VIP') {
      return res.status(403).json({ message: 'VIP 회원만 컨시어지 서비스를 이용할 수 있습니다.' });
    }

    // 필수 필드 검증
    if (!type || !description) {
      return res.status(400).json({ message: '서비스 유형과 상세 요청사항은 필수입니다.' });
    }

    // TODO: 실제 컨시어지 요청 처리 로직 구현
    // 현재는 성공 응답만 반환
    
    console.log('VIP 컨시어지 요청:', {
      userId,
      type,
      description,
      preferredDate
    });

    res.json({ 
      message: '컨시어지 요청이 성공적으로 접수되었습니다. 24시간 내에 연락드리겠습니다.',
      requestId: Date.now().toString()
    });
  } catch (error) {
    console.error('VIP 컨시어지 요청 실패:', error);
    res.status(500).json({ message: '컨시어지 요청에 실패했습니다.' });
  }
}; 