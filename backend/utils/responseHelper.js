const RESPONSE_CODES = require('./responseCodes');

/**
 * 성공 응답 생성
 * @param {string} code - 응답 코드
 * @param {string} devMessage - 개발자용 메시지 (영문)
 * @param {string} userMessage - 사용자용 메시지 (한국어)
 * @param {any} data - 응답 데이터
 * @returns {Object} 표준 성공 응답 객체
 */
const createSuccessResponse = (code, devMessage, userMessage, data = null) => {
    return {
        success: true,
        code,
        message: {
            dev: devMessage,
            user: userMessage
        },
        data
    };
};

/**
 * 오류 응답 생성
 * @param {string} code - 오류 코드
 * @param {string} devMessage - 개발자용 메시지 (영문)
 * @param {string} userMessage - 사용자용 메시지 (한국어)
 * @param {any} error - 오류 상세 정보
 * @returns {Object} 표준 오류 응답 객체
 */
const createErrorResponse = (code, devMessage, userMessage, error = null) => {
    return {
        success: false,
        code,
        message: {
            dev: devMessage,
            user: userMessage
        },
        error
    };
};

/**
 * Express 응답 객체에 성공 응답 전송
 * @param {Object} res - Express 응답 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {string} code - 응답 코드
 * @param {string} devMessage - 개발자용 메시지
 * @param {string} userMessage - 사용자용 메시지
 * @param {any} data - 응답 데이터
 */
const sendSuccess = (res, statusCode, code, devMessage, userMessage, data = null) => {
    res.status(statusCode).json(
        createSuccessResponse(code, devMessage, userMessage, data)
    );
};

/**
 * Express 응답 객체에 오류 응답 전송
 * @param {Object} res - Express 응답 객체
 * @param {number} statusCode - HTTP 상태 코드
 * @param {string} code - 오류 코드
 * @param {string} devMessage - 개발자용 메시지
 * @param {string} userMessage - 사용자용 메시지
 * @param {any} error - 오류 상세 정보
 */
const sendError = (res, statusCode, code, devMessage, userMessage, error = null) => {
    res.status(statusCode).json(
        createErrorResponse(code, devMessage, userMessage, error)
    );
};

/**
 * 일반적인 오류 응답들
 */
const commonErrors = {
    // 400 Bad Request
    badRequest: (res, devMessage = 'Invalid request parameters', userMessage = '잘못된 요청입니다') => {
        sendError(res, 400, RESPONSE_CODES.ERROR.INVALID_REQUEST, devMessage, userMessage);
    },

    // 401 Unauthorized
    unauthorized: (res, devMessage = 'Authentication required', userMessage = '로그인이 필요합니다') => {
        sendError(res, 401, RESPONSE_CODES.ERROR.UNAUTHORIZED, devMessage, userMessage);
    },

    // 403 Forbidden
    forbidden: (res, devMessage = 'Insufficient permissions', userMessage = '접근 권한이 없습니다') => {
        sendError(res, 403, RESPONSE_CODES.ERROR.FORBIDDEN, devMessage, userMessage);
    },

    // 404 Not Found
    notFound: (res, devMessage = 'Resource not found', userMessage = '요청한 정보를 찾을 수 없습니다') => {
        sendError(res, 404, RESPONSE_CODES.ERROR.RESOURCE_NOT_FOUND, devMessage, userMessage);
    },

    // 409 Conflict
    conflict: (res, devMessage = 'Resource conflict', userMessage = '요청이 충돌했습니다') => {
        sendError(res, 409, RESPONSE_CODES.ERROR.RESOURCE_CONFLICT, devMessage, userMessage);
    },

    // 422 Validation Error
    validationError: (res, devMessage = 'Validation failed', userMessage = '입력 정보가 올바르지 않습니다', errors = null) => {
        sendError(res, 422, RESPONSE_CODES.ERROR.VALIDATION_FAILED, devMessage, userMessage, errors);
    },

    // 500 Internal Server Error
    internalError: (res, devMessage = 'Internal server error', userMessage = '서버 오류가 발생했습니다', error = null) => {
        sendError(res, 500, RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR, devMessage, userMessage, error);
    }
};

module.exports = {
    RESPONSE_CODES,
    createSuccessResponse,
    createErrorResponse,
    sendSuccess,
    sendError,
    commonErrors
};