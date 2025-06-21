const { Business, User, Restaurant, Reservation, Review, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * @summary 사업자 등록 신청
 * @description 일반 또는 VIP 사용자가 사업자 등록을 신청합니다.
 */
exports.applyBusiness = async (req, res) => {
    const { user_id } = req.user;
    const { name, businessHours, seats, notifications } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: '사업자명은 필수입니다.' });
    }

    try {
        const existingBusiness = await Business.findOne({ where: { user_id } });
        if (existingBusiness) {
            return res.status(409).json({ success: false, message: '이미 사업자 신청 내역이 존재합니다.' });
        }

        const newBusiness = await Business.create({
            user_id,
            name,
            business_hours: businessHours || {},
            seats: seats || {},
            notifications: notifications || {},
            status: '대기중', // '대기중', '승인', '거절'
        });

        res.status(201).json({
            success: true,
            message: '사업자 신청이 성공적으로 접수되었습니다.',
            data: newBusiness,
        });
    } catch (error) {
        console.error('사업자 신청 처리 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

/**
 * @summary 내 사업자 신청 상태 조회
 * @description 사용자가 본인의 사업자 신청 상태(대기중, 승인, 거절)를 확인합니다.
 */
exports.getMyBusinessStatus = async (req, res) => {
    try {
        const business = await Business.findOne({ where: { user_id: req.user.id, status: '승인' } });
        if (!business) {
            return res.status(404).json({ success: false, message: '신청 내역이 없습니다.' });
        }
        res.json({ success: true, data: business });
    } catch (error) {
        console.error('신청 상태 조회 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

/**
 * @summary 사업자 설정 조회
 * @description 승인된 사업자가 본인의 영업시간, 좌석, 알림 설정을 조회합니다.
 */
exports.getBusinessSettings = async (req, res) => {
    try {
        const business = await Business.findOne({ where: { user_id: req.user.id, status: '승인' } });
        if (!business) {
            return res.status(404).json({ success: false, message: '승인된 사업자 정보를 찾을 수 없습니다.' });
        }
        res.json({
            success: true,
            data: {
                businessHours: business.business_hours,
                seats: business.seats,
                notifications: business.notifications,
            },
        });
    } catch (error) {
        console.error('사업자 설정 조회 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

/**
 * @summary 사업자 설정 수정
 * @description 승인된 사업자가 본인의 영업시간, 좌석, 알림 설정을 수정합니다.
 */
exports.updateBusinessSettings = async (req, res) => {
    const { businessHours, seats, notifications } = req.body;
    try {
        const business = await Business.findOne({ where: { user_id: req.user.id, status: '승인' } });
        if (!business) {
            return res.status(404).json({ success: false, message: '승인된 사업자 정보를 찾을 수 없습니다.' });
        }

        business.business_hours = businessHours ?? business.business_hours;
        business.seats = seats ?? business.seats;
        business.notifications = notifications ?? business.notifications;

        await business.save();
        res.json({ success: true, message: '사업자 설정이 성공적으로 업데이트되었습니다.', data: business });
    } catch (error) {
        console.error('사업자 설정 수정 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

/**
 * @summary 사업자 통계 조회
 * @description 승인된 사업자가 본인 레스토랑의 예약, 리뷰 기반 운영 성과를 확인합니다.
 */
exports.getBusinessStatistics = async (req, res) => {
    try {
        const business = await Business.findOne({
            where: { user_id: req.user.id, status: '승인' },
            include: [{ model: Restaurant, as: 'restaurants', attributes: ['restaurant_id'] }],
        });

        if (!business || !business.restaurants) {
            return res.status(404).json({ success: false, message: '승인된 사업자 또는 연결된 레스토랑 정보를 찾을 수 없습니다.' });
        }

        const restaurantIds = business.restaurants.map(r => r.restaurant_id);
        const totalReservations = await Reservation.count({ where: { restaurant_id: restaurantIds } });
        const totalReviews = await Review.count({ where: { restaurant_id: restaurantIds } });

        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        const recentReservations = await Reservation.count({
            where: { restaurant_id: restaurantIds, created_at: { [Op.gte]: thirtyDaysAgo } },
        });

        const { avgRating } = await Review.findOne({
            where: { restaurant_id: restaurantIds },
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
            raw: true
        });

        res.json({
            success: true,
            data: {
                totalRestaurants: restaurantIds.length,
                totalReservations,
                totalReviews,
                recentReservations,
                averageRating: avgRating ? parseFloat(avgRating).toFixed(2) : '0.00',
            },
        });
    } catch (error) {
        console.error('사업자 통계 조회 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

/**
 * @summary (관리자) 전체 사업자 신청 목록 조회
 * @description 관리자가 전체 사업자 신청 목록을 페이징 및 검색 기능과 함께 조회합니다.
 */
exports.getAllBusinessApplications = async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    try {
        let where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }
        if (status) {
            where.status = status;
        }

        const { count, rows: applications } = await Business.findAndCountAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: {
                applications,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                },
            },
        });
    } catch (error) {
        console.error('전체 신청 목록 조회 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};

/**
 * @summary (관리자) 사업자 신청 상태 변경
 * @description 관리자가 특정 사업자 신청을 승인 또는 거절합니다. 승인 시 사용자의 역할이 '사업자'로 변경됩니다.
 */
exports.updateBusinessStatus = async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body; // status: '승인' or '거절'

    if (!['승인', '거절'].includes(status)) {
        return res.status(400).json({ success: false, message: "상태 값은 '승인' 또는 '거절'이어야 합니다." });
    }

    const t = await sequelize.transaction();
    try {
        const business = await Business.findByPk(id, { transaction: t });
        if (!business) {
            await t.rollback();
            return res.status(404).json({ success: false, message: '해당 신청을 찾을 수 없습니다.' });
        }

        business.status = status;
        if (status === '거절') {
            business.rejection_reason = reason;
        }
        await business.save({ transaction: t });

        if (status === '승인') {
            await User.update({ role: '사업자' }, { where: { user_id: business.user_id }, transaction: t });
        }

        await t.commit();
        res.json({ success: true, message: `사업자 신청이 ${status} 처리되었습니다.`, data: business });
    } catch (error) {
        await t.rollback();
        console.error('상태 업데이트 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.', error: error.message });
    }
};