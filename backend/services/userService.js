const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { NotificationSetting } = require('../models');

exports.getUserById = async (user_id) => {
  return await User.findByPk(user_id, { attributes: { exclude: ['password'] } });
};

exports.updateUserProfile = async (user_id, { name, email, currentPassword, newPassword }) => {
  const user = await User.findByPk(user_id);
  if (!user) throw { status: 404, message: '사용자를 찾을 수 없습니다.' };

  // 현재 비밀번호 확인
  if (currentPassword) {
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) throw { status: 400, message: '현재 비밀번호가 일치하지 않습니다.' };
  }

  // 이메일 중복 확인
  if (email) {
    const existing = await User.findOne({ where: { email, user_id: { [Op.ne]: user_id } } });
    if (existing) throw { status: 400, message: '이미 사용 중인 이메일입니다.' };
  }

  // 업데이트
  if (name) user.name = name;
  if (email) user.email = email;
  if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
  // 반환값에서 password 등 민감정보 제외
  const { password, ...userData } = user.toJSON();
  return userData;
};

exports.getNotificationSettings = async (user_id) => {
  let settings = await NotificationSetting.findOne({ where: { user_id } });
  if (!settings) {
    settings = await NotificationSetting.create({
      user_id,
      reservation_confirmation: true,
      reservation_reminder: true,
      review_response: true,
      marketing_info: false
    });
  }
  return settings;
};

exports.updateNotificationSettings = async (user_id, data) => {
  let settings = await NotificationSetting.findOne({ where: { user_id } });
  if (settings) {
    await settings.update(data);
  } else {
    settings = await NotificationSetting.create({ user_id, ...data });
  }
  return settings;
}; 