const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// 리뷰 목록 조회
router.get('/', async (req, res) => {
  try {
    const { restaurant_id, user_id } = req.query;
    let query = 'SELECT * FROM reviews';
    const params = [];

    if (restaurant_id) {
      query += ' WHERE restaurant_id = ?';
      params.push(restaurant_id);
    } else if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY created_at DESC';
    
    const [reviews] = await pool.query(query, params);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 리뷰 작성
router.post('/', auth, async (req, res) => {
  try {
    const { restaurant_id, rating, content } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, restaurant_id, rating, content) VALUES (?, ?, ?, ?)',
      [user_id, restaurant_id, rating, content]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      restaurant_id,
      rating,
      content,
      created_at: new Date()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 리뷰 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;
    const user_id = req.user.id;

    // 리뷰 작성자 확인
    const [review] = await pool.query(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (review.length === 0) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    await pool.query(
      'UPDATE reviews SET rating = ?, content = ? WHERE id = ?',
      [rating, content, id]
    );

    res.json({ message: '리뷰가 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 리뷰 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // 리뷰 작성자 확인
    const [review] = await pool.query(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (review.length === 0) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 