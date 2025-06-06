const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// 관심 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [favorites] = await pool.query(`
      SELECT f.*, r.name_korean, r.address, r.image, r.type, r.rating
      FROM favorites f
      JOIN restaurants r ON f.restaurant_id = r.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [user_id]);

    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 관심 목록 추가
router.post('/', auth, async (req, res) => {
  try {
    const { restaurant_id } = req.body;
    const user_id = req.user.id;

    // 이미 관심 목록에 있는지 확인
    const [existing] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND restaurant_id = ?',
      [user_id, restaurant_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 관심 목록에 추가되어 있습니다.' });
    }

    const [result] = await pool.query(
      'INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)',
      [user_id, restaurant_id]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      restaurant_id,
      created_at: new Date()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 관심 목록 삭제
router.delete('/:restaurant_id', auth, async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const user_id = req.user.id;

    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND restaurant_id = ?',
      [user_id, restaurant_id]
    );

    res.json({ message: '관심 목록에서 제거되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 