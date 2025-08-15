export interface ExpenseData {
  [key: string]: any;
}

const API_BASE_URL = 'http://localhost:3001/api';

export class DatabaseService {
  static async getExpensesData(): Promise<ExpenseData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取数据失败');
      }
      
      return result.data;
    } catch (error) {
      console.error('API调用错误:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}
