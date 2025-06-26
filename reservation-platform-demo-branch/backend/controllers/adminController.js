const { User, VipRequest, Reservation, Restaurant, Review, Payment } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

// 관리자 대시보드 데이터 조회
exports.getAdminDashboard = async (req, res) => {
    try {
        // 전체 통계 데이터 조회
        const totalUsers = await User.count();
        const totalRestaurants = await Restaurant.count();
        const totalReservations = await Reservation.count();
        const totalVipRequests = await VipRequest.count();
        const totalReviews = await Review.count();
        const totalPayments = await Payment.count();

        // 최근 활동 데이터
        const recentUsers = await User.findAll({
            order: [['created_at', 'DESC']],
            limit: 5,
            attributes: ['id', 'name', 'email', 'created_at']
        });

        const recentReservations = await Reservation.findAll({
            include: [
                { model: User, attributes: ['name'] },
                { model: Restaurant, attributes: ['name_korean'] }
            ],
            order: [['created_at', 'DESC']],
            limit: 5
        });

        const pendingVipRequests = await VipRequest.count({
            where: { status: '대기중' }
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_STATS_GET,
            'Admin dashboard data retrieved successfully',
            '관리자 대시보드 데이터를 성공적으로 조회했습니다',
            {
                stats: {
                    totalUsers,
                    totalRestaurants,
                    totalReservations,
                    totalVipRequests,
                    totalReviews,
                    totalPayments,
                    pendingVipRequests
                },
                recentActivity: {
                    recentUsers,
                    recentReservations
                }
            });
    } catch (err) {
        console.error('관리자 대시보드 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve admin dashboard data',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 모든 사용자 목록 조회
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        if (role) {
            where.role = role;
        }

        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_USER_LIST_GET,
            'User list retrieved successfully',
            '사용자 목록을 성공적으로 조회했습니다',
            {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    total: count,
                    limit: parseInt(limit)
                }
            });
    } catch (err) {
        console.error('사용자 목록 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve user list',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 특정 사용자 상세 정보 조회
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Reservation,
                    include: [{ model: Restaurant, attributes: ['name_korean'] }]
                },
                {
                    model: Review,
                    include: [{ model: Restaurant, attributes: ['name_korean'] }]
                },
                {
                    model: VipRequest
                }
            ]
        });

        if (!user) {
            return commonErrors.notFound(res, 'User not found', '사용자를 찾을 수 없습니다');
        }

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
            'User details retrieved successfully',
            '사용자 상세 정보를 성공적으로 조회했습니다',
            user);
    } catch (err) {
        console.error('사용자 상세 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve user details',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 사용자 삭제
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 본인 계정 삭제 방지
        if (parseInt(id) === parseInt(req.user.id)) {
            return sendError(res, 400, RESPONSE_CODES.ERROR.INVALID_REQUEST,
                'Cannot delete own account',
                '본인 계정은 삭제할 수 없습니다');
        }

        const user = await User.findByPk(id);
        if (!user) {
            return commonErrors.notFound(res, 'User not found', '사용자를 찾을 수 없습니다');
        }

        // 관리자 계정 삭제 방지
        if (user.role === '관리자') {
            return sendError(res, 400, RESPONSE_CODES.ERROR.INSUFFICIENT_PERMISSIONS,
                'Cannot delete admin account',
                '관리자 계정은 삭제할 수 없습니다');
        }

        await user.destroy();

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.OPERATION_COMPLETED,
            'User deleted successfully',
            '사용자가 성공적으로 삭제되었습니다');
    } catch (err) {
        console.error('사용자 삭제 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to delete user',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 사용자 역할 변경
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['일반', 'VIP', '관리자'].includes(role)) {
            return commonErrors.validationError(res, 'Invalid role value', '유효한 역할을 지정해주세요');
        }

        const user = await User.findByPk(id);
        if (!user) {
            return commonErrors.notFound(res, 'User not found', '사용자를 찾을 수 없습니다');
        }

        // 본인 역할 변경 방지
        if (parseInt(id) === parseInt(req.user.id)) {
            return sendError(res, 400, RESPONSE_CODES.ERROR.INVALID_REQUEST,
                'Cannot change own role',
                '본인의 역할은 변경할 수 없습니다');
        }

        user.role = role;
        await user.save();

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.OPERATION_COMPLETED,
            'User role updated successfully',
            '사용자 역할이 변경되었습니다',
            { id: user.id, role: user.role });
    } catch (err) {
        console.error('사용자 역할 변경 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to update user role',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 모든 예약 목록 조회
exports.getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, restaurant_id } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        if (status) where.status = status;
        if (restaurant_id) where.restaurant_id = restaurant_id;

        const { count, rows: reservations } = await Reservation.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Restaurant, attributes: ['id', 'name_korean'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_RESERVATION_LIST_GET,
            'Reservation list retrieved successfully',
            '예약 목록을 성공적으로 조회했습니다',
            {
                reservations,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    total: count,
                    limit: parseInt(limit)
                }
            });
    } catch (err) {
        console.error('예약 목록 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve reservation list',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 모든 리뷰 목록 조회
exports.getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, restaurant_id, rating } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        if (restaurant_id) where.restaurant_id = restaurant_id;
        if (rating) where.rating = rating;

        const { count, rows: reviews } = await Review.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'name'] },
                { model: Restaurant, attributes: ['id', 'name_korean'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_LIST_GET,
            'Review list retrieved successfully',
            '리뷰 목록을 성공적으로 조회했습니다',
            {
                reviews,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    total: count,
                    limit: parseInt(limit)
                }
            });
    } catch (err) {
        console.error('리뷰 목록 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve review list',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByPk(id);
        if (!review) {
            return commonErrors.notFound(res, 'Review not found', '리뷰를 찾을 수 없습니다');
        }

        await review.destroy();

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.REVIEW_DELETED,
            'Review deleted successfully',
            '리뷰가 삭제되었습니다');
    } catch (err) {
        console.error('리뷰 삭제 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to delete review',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 모든 VIP 요청 목록 조회
exports.getAllVipRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        if (status) where.status = status;

        const { count, rows: vipRequests } = await VipRequest.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'name', 'email'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_VIP_REQUEST_LIST_GET,
            'VIP request list retrieved successfully',
            'VIP 요청 목록을 성공적으로 조회했습니다',
            {
                vipRequests,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    total: count,
                    limit: parseInt(limit)
                }
            });
    } catch (err) {
        console.error('VIP 요청 목록 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve VIP request list',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 시스템 통계 조회
exports.getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalRestaurants = await Restaurant.count();
        const totalReservations = await Reservation.count();
        const totalReviews = await Review.count();
        const totalVipRequests = await VipRequest.count();
        const totalPayments = await Payment.count();

        // 상태별 통계
        const pendingVipRequests = await VipRequest.count({ where: { status: '대기중' } });
        const approvedVipRequests = await VipRequest.count({ where: { status: '승인' } });
        const rejectedVipRequests = await VipRequest.count({ where: { status: '거절' } });

        const confirmedReservations = await Reservation.count({ where: { status: 'confirmed' } });
        const cancelledReservations = await Reservation.count({ where: { status: 'cancelled' } });

        // 역할별 사용자 통계
        const regularUsers = await User.count({ where: { role: '일반' } });
        const vipUsers = await User.count({ where: { role: 'VIP' } });
        const adminUsers = await User.count({ where: { role: '관리자' } });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_STATS_GET,
            'System statistics retrieved successfully',
            '시스템 통계를 성공적으로 조회했습니다',
            {
                overview: {
                    totalUsers,
                    totalRestaurants,
                    totalReservations,
                    totalReviews,
                    totalVipRequests,
                    totalPayments
                },
                vipRequests: {
                    pending: pendingVipRequests,
                    approved: approvedVipRequests,
                    rejected: rejectedVipRequests
                },
                reservations: {
                    confirmed: confirmedReservations,
                    cancelled: cancelledReservations
                },
                users: {
                    regular: regularUsers,
                    vip: vipUsers,
                    admin: adminUsers
                }
            });
    } catch (err) {
        console.error('시스템 통계 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve system statistics',
            '서버 오류가 발생했습니다',
            err.message);
    }
};