const { Business, User, Restaurant, Reservation, Review, sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

/**
 * @summary 사업자 등록 신청
 * @description 일반 또는 VIP 사용자가 사업자 등록을 신청합니다.
 */
exports.applyBusiness = async (req, res) => {
    const { user_id } = req.user;
    const { name, businessHours, seats, notifications } = req.body;

    if (!name) {
        return commonErrors.validationError(res, 'Business name is required', '사업자명은 필수입니다');
    }

    try {
        const existingBusiness = await Business.findOne({ where: { user_id } });
        if (existingBusiness) {
            return sendError(res, 409, RESPONSE_CODES.ERROR.RESOURCE_CONFLICT,
                'Business application already exists',
                '이미 사업자 신청 내역이 존재합니다');
        }

        const newBusiness = await Business.create({
            user_id,
            name,
            business_hours: businessHours || {},
            seats: seats || {},
            notifications: notifications || {},
            status: '대기중', // '대기중', '승인', '거절'
        });

        sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.BUSINESS_APPLIED,
            'Business application submitted successfully',
            '사업자 신청이 성공적으로 접수되었습니다',
            newBusiness);
    } catch (error) {
        console.error('사업자 신청 처리 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to submit business application',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
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
            return commonErrors.notFound(res, 'Business application not found', '신청 내역이 없습니다');
        }
        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.BUSINESS_STATUS_GET,
            'Business status retrieved successfully',
            '사업자 신청 상태를 성공적으로 조회했습니다',
            business);
    } catch (error) {
        console.error('신청 상태 조회 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve business status',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
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
            return commonErrors.notFound(res, 'Approved business not found', '승인된 사업자 정보를 찾을 수 없습니다');
        }
        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.BUSINESS_SETTINGS_GET,
            'Business settings retrieved successfully',
            '사업자 설정을 성공적으로 조회했습니다',
            {
                businessHours: business.business_hours,
                seats: business.seats,
                notifications: business.notifications,
            });
    } catch (error) {
        console.error('사업자 설정 조회 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve business settings',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
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
            return commonErrors.notFound(res, 'Approved business not found', '승인된 사업자 정보를 찾을 수 없습니다');
        }

        business.business_hours = businessHours ?? business.business_hours;
        business.seats = seats ?? business.seats;
        business.notifications = notifications ?? business.notifications;

        await business.save();
        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.BUSINESS_SETTINGS_UPDATED,
            'Business settings updated successfully',
            '사업자 설정이 성공적으로 업데이트되었습니다',
            business);
    } catch (error) {
        console.error('사업자 설정 수정 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to update business settings',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
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
            return commonErrors.notFound(res, 'Approved business or connected restaurants not found', '승인된 사업자 또는 연결된 레스토랑 정보를 찾을 수 없습니다');
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

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
            'Business statistics retrieved successfully',
            '사업자 통계를 성공적으로 조회했습니다',
            {
                totalRestaurants: restaurantIds.length,
                totalReservations,
                totalReviews,
                recentReservations,
                averageRating: avgRating ? parseFloat(avgRating).toFixed(2) : '0.00',
            });
    } catch (error) {
        console.error('사업자 통계 조회 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve business statistics',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
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

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
            'Business applications retrieved successfully',
            '사업자 신청 목록을 성공적으로 조회했습니다',
            {
                applications,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                },
            });
    } catch (error) {
        console.error('전체 신청 목록 조회 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve business applications',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
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
        return commonErrors.validationError(res, 'Invalid status value', "상태 값은 '승인' 또는 '거절'이어야 합니다");
    }

    const t = await sequelize.transaction();
    try {
        const business = await Business.findByPk(id, { transaction: t });
        if (!business) {
            await t.rollback();
            return commonErrors.notFound(res, 'Business application not found', '해당 신청을 찾을 수 없습니다');
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

        const responseCode = status === '승인' ? RESPONSE_CODES.SUCCESS.ADMIN_BUSINESS_APPROVED : RESPONSE_CODES.SUCCESS.ADMIN_BUSINESS_REJECTED;
        const devMessage = status === '승인' ? 'Business application approved successfully' : 'Business application rejected successfully';
        const userMessage = status === '승인' ? '사업자 신청이 승인 처리되었습니다' : '사업자 신청이 거절 처리되었습니다';

        sendSuccess(res, 200, responseCode, devMessage, userMessage, business);
    } catch (error) {
        await t.rollback();
        console.error('상태 업데이트 중 오류 발생:', error);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to update business status',
            '서버 처리 중 오류가 발생했습니다',
            error.message);
    }
};