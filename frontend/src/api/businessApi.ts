import { apiRequest } from '../utils/api';

export const businessApi = {
  /**
   * 사업자 설정 조회
   * @returns Promise<BusinessSettings>
   */
  getSettings: () => apiRequest('/api/business/settings'),

  /**
   * 사업자 설정 수정
   * @param payload BusinessSettings
   * @returns Promise<{ success: boolean }>
   */
  updateSettings: (payload: any) =>
    apiRequest('/api/business/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  /**
   * 사업자 통계 조회
   * @returns Promise<BusinessStatistics>
   */
  getStatistics: () => apiRequest('/api/business/statistics'),
}; 