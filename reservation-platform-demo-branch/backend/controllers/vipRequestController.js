const { VipRequest, User } = require('../models');
const { sendSuccess, sendError, commonErrors, RESPONSE_CODES } = require('../utils/responseHelper');

// VIP 요청 등록
exports.createVipRequest = async (req, res) => {
    try {
        const { company_name, itinerary } = req.body;
        const user_id = req.user.id;

        // 입력값 검증
        if (!company_name || !itinerary) {
            return commonErrors.validationError(res, 'Missing required fields', '회사명과 일정은 필수입니다');
        }

        const vipRequest = await VipRequest.create({
            user_id,
            company_name,
            itinerary,
            status: '대기중'
        });

        sendSuccess(res, 201, RESPONSE_CODES.SUCCESS.VIP_REQUEST_CREATED,
            'VIP request created successfully',
            'VIP 요청이 성공적으로 등록되었습니다',
            vipRequest);
    } catch (err) {
        console.error('VIP 요청 등록 실패:', err);
        sendError(res, 400, RESPONSE_CODES.ERROR.VALIDATION_FAILED,
            'Failed to create VIP request',
            'VIP 요청 등록에 실패했습니다',
            err.message);
    }
};

// 내 VIP 요청 목록 조회 (본인만 조회 가능)
exports.getUserVipRequests = async (req, res) => {
    try {
        // 본인만 조회 가능
        if (parseInt(req.user.id) !== parseInt(req.params.user_id)) {
            return commonErrors.forbidden(res, 'Can only view own VIP requests', '본인의 VIP 요청만 조회할 수 있습니다');
        }

        const vipRequests = await VipRequest.findAll({
            where: { user_id: req.params.user_id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.VIP_REQUEST_LIST_GET,
            'User VIP requests retrieved successfully',
            'VIP 요청 목록을 성공적으로 조회했습니다',
            vipRequests);
    } catch (err) {
        console.error('VIP 요청 목록 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve VIP requests',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 모든 VIP 요청 목록 조회 (관리자용)
exports.getAllVipRequests = async (req, res) => {
    try {
        const vipRequests = await VipRequest.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_VIP_REQUEST_LIST_GET,
            'All VIP requests retrieved successfully',
            '전체 VIP 요청 목록을 성공적으로 조회했습니다',
            vipRequests);
    } catch (err) {
        console.error('전체 VIP 요청 목록 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve all VIP requests',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// 특정 VIP 요청 상세 조회
exports.getVipRequestById = async (req, res) => {
    try {
        const vipRequest = await VipRequest.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!vipRequest) {
            return commonErrors.notFound(res, 'VIP request not found', 'VIP 요청을 찾을 수 없습니다');
        }

        // 본인 또는 관리자만 조회 가능
        if (vipRequest.user_id !== req.user.id && req.user.role !== '관리자') {
            return commonErrors.forbidden(res, 'No permission to view VIP request', '조회 권한이 없습니다');
        }

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
            'VIP request details retrieved successfully',
            'VIP 요청 상세 정보를 성공적으로 조회했습니다',
            vipRequest);
    } catch (err) {
        console.error('VIP 요청 상세 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve VIP request details',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// VIP 요청 승인 (관리자용)
exports.approveVipRequest = async (req, res) => {
    try {
        const vipRequest = await VipRequest.findByPk(req.params.id);
        if (!vipRequest) {
            return commonErrors.notFound(res, 'VIP request not found', 'VIP 요청을 찾을 수 없습니다');
        }

        // 이미 처리된 요청인지 확인
        if (vipRequest.status !== '대기중') {
            return sendError(res, 400, RESPONSE_CODES.ERROR.RESOURCE_CONFLICT,
                'Request already processed',
                '이미 처리되었거나 대기중이 아닌 요청입니다');
        }

        vipRequest.status = '승인';
        vipRequest.approved_at = new Date();
        vipRequest.approved_by = req.user.id;

        await vipRequest.save();

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_VIP_REQUEST_APPROVED,
            'VIP request approved successfully',
            'VIP 요청이 승인되었습니다',
            vipRequest);
    } catch (err) {
        console.error('VIP 요청 승인 실패:', err);
        sendError(res, 400, RESPONSE_CODES.ERROR.VALIDATION_FAILED,
            'Failed to approve VIP request',
            'VIP 요청 승인에 실패했습니다',
            err.message);
    }
};

// VIP 요청 거절 (관리자용)
exports.rejectVipRequest = async (req, res) => {
    try {
        const { reason } = req.body;
        const vipRequest = await VipRequest.findByPk(req.params.id);
        if (!vipRequest) {
            return commonErrors.notFound(res, 'VIP request not found', 'VIP 요청을 찾을 수 없습니다');
        }

        // 이미 처리된 요청인지 확인
        if (vipRequest.status !== '대기중') {
            return sendError(res, 400, RESPONSE_CODES.ERROR.RESOURCE_CONFLICT,
                'Request already processed',
                '이미 처리되었거나 대기중이 아닌 요청입니다');
        }

        vipRequest.status = '거절';
        vipRequest.rejected_at = new Date();
        vipRequest.rejected_by = req.user.id;
        vipRequest.rejection_reason = reason;

        await vipRequest.save();

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.ADMIN_VIP_REQUEST_REJECTED,
            'VIP request rejected successfully',
            'VIP 요청이 거절되었습니다',
            vipRequest);
    } catch (err) {
        console.error('VIP 요청 거절 실패:', err);
        sendError(res, 400, RESPONSE_CODES.ERROR.VALIDATION_FAILED,
            'Failed to reject VIP request',
            'VIP 요청 거절에 실패했습니다',
            err.message);
    }
};

// VIP 요청 삭제
exports.deleteVipRequest = async (req, res) => {
    try {
        const vipRequest = await VipRequest.findByPk(req.params.id);
        if (!vipRequest) {
            return commonErrors.notFound(res, 'VIP request not found', 'VIP 요청을 찾을 수 없습니다');
        }

        // 본인 또는 관리자만 삭제 가능
        if (vipRequest.user_id !== req.user.id && req.user.role !== '관리자') {
            return commonErrors.forbidden(res, 'No permission to delete VIP request', '삭제 권한이 없습니다');
        }

        await vipRequest.destroy();

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.OPERATION_COMPLETED,
            'VIP request deleted successfully',
            'VIP 요청이 삭제되었습니다');
    } catch (err) {
        console.error('VIP 요청 삭제 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to delete VIP request',
            '서버 오류가 발생했습니다',
            err.message);
    }
};

// VIP 요청 통계 (관리자용)
exports.getVipRequestStats = async (req, res) => {
    try {
        const totalRequests = await VipRequest.count();
        const pendingRequests = await VipRequest.count({ where: { status: '대기중' } });
        const approvedRequests = await VipRequest.count({ where: { status: '승인' } });
        const rejectedRequests = await VipRequest.count({ where: { status: '거절' } });

        sendSuccess(res, 200, RESPONSE_CODES.SUCCESS.DATA_RETRIEVED,
            'VIP request statistics retrieved successfully',
            'VIP 요청 통계를 성공적으로 조회했습니다',
            {
                total: totalRequests,
                pending: pendingRequests,
                approved: approvedRequests,
                rejected: rejectedRequests
            });
    } catch (err) {
        console.error('VIP 요청 통계 조회 실패:', err);
        sendError(res, 500, RESPONSE_CODES.ERROR.DATABASE_ERROR,
            'Failed to retrieve VIP request statistics',
            '서버 오류가 발생했습니다',
            err.message);
    }
};