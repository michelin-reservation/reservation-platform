const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../db');

// 회원 정보 수정
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // 현재 비밀번호 확인
    if (currentPassword) {
      const [user] = await pool.query(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      if (!user.length) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user[0].password);
      if (!validPassword) {
        return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
      }
    }

    // 이메일 중복 확인
    if (email) {
      const [existingUser] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
      }
    }

    // 업데이트할 데이터 준비
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: '업데이트할 정보가 없습니다.' });
    }

    values.push(userId);

    // 사용자 정보 업데이트
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // 업데이트된 사용자 정보 조회
    const [updatedUser] = await pool.query(
      'SELECT id, name, email, is_vip, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 알림 설정 조회
router.get('/notifications', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [settings] = await pool.query(
      'SELECT * FROM notification_settings WHERE user_id = ?',
      [userId]
    );

    if (!settings.length) {
      // 기본 설정 생성
      const defaultSettings = {
        reservation_confirmation: true,
        reservation_reminder: true,
        review_response: true,
        marketing_info: false
      };

      await pool.query(
        'INSERT INTO notification_settings (user_id, reservation_confirmation, reservation_reminder, review_response, marketing_info) VALUES (?, ?, ?, ?, ?)',
        [userId, true, true, true, false]
      );

      return res.json(defaultSettings);
    }

    res.json(settings[0]);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 알림 설정 업데이트
router.put('/notifications', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const {
    reservation_confirmation,
    reservation_reminder,
    review_response,
    marketing_info
  } = req.body;

  try {
    const [settings] = await pool.query(
      'SELECT id FROM notification_settings WHERE user_id = ?',
      [userId]
    );

    if (settings.length) {
      // 기존 설정 업데이트
      await pool.query(
        `UPDATE notification_settings 
         SET reservation_confirmation = ?,
             reservation_reminder = ?,
             review_response = ?,
             marketing_info = ?
         WHERE user_id = ?`,
        [
          reservation_confirmation,
          reservation_reminder,
          review_response,
          marketing_info,
          userId
        ]
      );
    } else {
      // 새 설정 생성
      await pool.query(
        `INSERT INTO notification_settings 
         (user_id, reservation_confirmation, reservation_reminder, review_response, marketing_info)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          reservation_confirmation,
          reservation_reminder,
          review_response,
          marketing_info
        ]
      );
    }

    res.json({
      message: '알림 설정이 업데이트되었습니다.',
      settings: {
        reservation_confirmation,
        reservation_reminder,
        review_response,
        marketing_info
      }
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 