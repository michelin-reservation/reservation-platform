import prisma from '../utils/prismaClient';
// [from TS]
export const getUserById = (id: string) => prisma.user.findUnique({ where: { id } });
export const createUser = (data: any) => prisma.user.create({ data });

// [from JS]
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// Sequelize 기반 User 모델 및 NotificationSetting 모델은 JS 코드 참고
// 실제 서비스 전환 시 Prisma 모델로 변환 필요

export const getUserByEmail = async (email: string) => {
    // TODO: Prisma로 변환 필요
    // return await prisma.user.findUnique({ where: { email } });
    return null; // 임시
};

export const updateUserProfile = async (user_id: string, { name, email, currentPassword, newPassword }: any) => {
    // TODO: Prisma로 변환 필요
    // 아래는 JS 코드 로직 보존
    // const user = await User.findByPk(user_id);
    // if (!user) throw { status: 404, message: '사용자를 찾을 수 없습니다.' };
    // if (currentPassword) {
    //   const validPassword = await bcrypt.compare(currentPassword, user.password);
    //   if (!validPassword) throw { status: 400, message: '현재 비밀번호가 일치하지 않습니다.' };
    // }
    // if (email) {
    //   const existing = await User.findOne({ where: { email, user_id: { [Op.ne]: user_id } } });
    //   if (existing) throw { status: 400, message: '이미 사용 중인 이메일입니다.' };
    // }
    // if (name) user.name = name;
    // if (email) user.email = email;
    // if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
    // await user.save();
    // const { password, ...userData } = user.toJSON();
    // return userData;
    return null; // 임시
};

export const getNotificationSettings = async (user_id: string) => {
    // TODO: Prisma로 변환 필요
    // let settings = await NotificationSetting.findOne({ where: { user_id } });
    // if (!settings) {
    //   settings = await NotificationSetting.create({
    //     user_id,
    //     reservation_confirmation: true,
    //     reservation_reminder: true,
    //     review_response: true,
    //     marketing_info: false
    //   });
    // }
    // return settings;
    return null; // 임시
};

export const updateNotificationSettings = async (user_id: string, data: any) => {
    // TODO: Prisma로 변환 필요
    // let settings = await NotificationSetting.findOne({ where: { user_id } });
    // if (settings) {
    //   await settings.update(data);
    // } else {
    //   settings = await NotificationSetting.create({ user_id, ...data });
    // }
    // return settings;
    return null; // 임시
};
