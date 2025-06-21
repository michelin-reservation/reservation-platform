const { Favorite, Restaurant, User } = require('../models');

// 관심 목록 조회
exports.getFavorites = async (req, res) => {
    try {
        const user_id = req.user.id;
        const favorites = await Favorite.findAll({
            where: { user_id },
            include: [{
                model: Restaurant,
                as: 'restaurant',
                attributes: [
                    ['id', 'restaurant_id'],
                    ['name_korean', 'nameKorean'],
                    'address',
                    'image',
                    'type',
                    'rating'
                ]
            }],
            order: [['created_at', 'DESC']]
        });

        // 프론트 요구에 맞게 평탄화
        const result = favorites.map(fav => ({
            restaurant_id: fav.restaurant?.restaurant_id,
            nameKorean: fav.restaurant?.nameKorean,
            address: fav.restaurant?.address,
            image: fav.restaurant?.image,
            type: fav.restaurant?.type,
            rating: fav.restaurant?.rating
        }));

        res.json({ success: true, data: result });
    } catch (err) {
        console.error('관심 목록 조회 실패:', err);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

// 관심 목록 추가
exports.addFavorite = async (req, res) => {
    try {
        const { restaurant_id } = req.body;
        const user_id = req.user.id;

        // 입력값 검증
        if (!restaurant_id) {
            return res.status(400).json({
                success: false,
                message: '식당 ID는 필수입니다.'
            });
        }

        // 식당 존재 여부 확인
        const restaurant = await Restaurant.findByPk(restaurant_id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: '존재하지 않는 식당입니다.'
            });
        }

        // 이미 관심 목록에 있는지 확인
        const existing = await Favorite.findOne({
            where: { user_id, restaurant_id }
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: '이미 관심 목록에 추가되어 있습니다.'
            });
        }

        const favorite = await Favorite.create({ user_id, restaurant_id });

        res.status(201).json({
            success: true,
            message: '관심 목록에 추가되었습니다.',
            data: favorite
        });
    } catch (err) {
        console.error('관심 목록 추가 실패:', err);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

// 관심 목록 삭제
exports.removeFavorite = async (req, res) => {
    try {
        const { restaurant_id } = req.params;
        const user_id = req.user.id;

        // 입력값 검증
        if (!restaurant_id) {
            return res.status(400).json({
                success: false,
                message: '식당 ID는 필수입니다.'
            });
        }

        // 관심 목록에서 제거
        const deleted = await Favorite.destroy({
            where: { user_id, restaurant_id }
        });

        if (deleted) {
            res.json({
                success: true,
                message: '관심 목록에서 제거되었습니다.'
            });
        } else {
            res.status(404).json({
                success: false,
                message: '관심 목록에 해당 식당이 없습니다.'
            });
        }
    } catch (err) {
        console.error('관심 목록 삭제 실패:', err);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

// 특정 식당의 관심 목록 여부 확인
exports.checkFavorite = async (req, res) => {
    try {
        const { restaurant_id } = req.params;
        const user_id = req.user.id;

        const favorite = await Favorite.findOne({
            where: { user_id, restaurant_id }
        });

        res.json({
            success: true,
            isFavorite: !!favorite
        });
    } catch (err) {
        console.error('관심 목록 확인 실패:', err);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

// 사용자별 관심 목록 개수 조회
exports.getFavoriteCount = async (req, res) => {
    try {
        const user_id = req.user.id;

        const count = await Favorite.count({
            where: { user_id }
        });

        res.json({
            success: true,
            count: count
        });
    } catch (err) {
        console.error('관심 목록 개수 조회 실패:', err);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};