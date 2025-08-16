import React, { useState, useEffect, useMemo } from 'react';
import { MonthlyExpenseTable } from '../components/MonthlyExpenseTable';
import { DatabaseService, type MonthlyExpenseData } from '../services/databaseService';
import { getCurrentLanguage, setLanguagePreference, getSupportedLanguages, translatePageText } from '../utils/columnTranslations';

export const MonthlyExpensePage: React.FC = () => {
  const [data, setData] = useState<MonthlyExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('2025-08'); // 默认选择2025年8月

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const monthlyExpensesData = await DatabaseService.getMonthlyExpensesData(selectedMonth);
      setData(monthlyExpensesData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据时发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const handleRefresh = () => {
    loadData();
  };

  const handleLanguageChange = (language: string) => {
    setLanguagePreference(language);
    setCurrentLanguage(language);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  // 计算总金额
  const totalAmount = useMemo(() => {
    return data.reduce((sum, item) => {
      const amount = Number(item.AMOUNT || item.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [data]);

  // 生成月份选项（最近12个月）
  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      options.push({ value: monthKey, label: monthLabel });
    }
    return options;
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">月度费用管理</h1>
              <p className="mt-2 text-sm text-gray-300">
                查看和管理月度费用支出记录
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* 月份选择器 */}
              <div className="month-selector">
                <span className="month-selector-label text-gray-300">月份:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="month-selector-dropdown"
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value} className="month-selector-option">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 语言切换 */}
              <div className="language-selector">
                <span className="language-selector-label">{translatePageText('LANGUAGE_LABEL', currentLanguage)}</span>
                <select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="language-selector-dropdown"
                >
                  {Object.entries(getSupportedLanguages()).map(([code, name]) => (
                    <option key={code} value={code} className="language-selector-option">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              
              {lastUpdated && (
                <div className="text-sm text-gray-400">
                  {translatePageText('LAST_UPDATED', currentLanguage)} {lastUpdated.toLocaleString('zh-CN')}
                </div>
              )}
              
              <button
                onClick={() => setShowHealthCheck(!showHealthCheck)}
                className="health-check-toggle"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showHealthCheck ? translatePageText('HIDE_STATS', currentLanguage) : translatePageText('SHOW_STATS', currentLanguage)}
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {translatePageText('REFRESHING', currentLanguage)}
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {translatePageText('REFRESH_BUTTON', currentLanguage)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 数据统计卡片 */}
        {data.length > 0 && showHealthCheck && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总记录数</dt>
                      <dd className="text-lg font-medium text-gray-900">{data.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">数据列数</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.length > 0 ? Object.keys(data[0]).length : 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">数据库状态</dt>
                      <dd className="text-lg font-medium text-green-600">已连接</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 合计金额行 */}
        {data.length > 0 && (
          <div className="summary-row">
            <div className="summary-row-header">
              <div className="summary-row-content">
                <div className="summary-row-label">{translatePageText('TOTAL_AMOUNT', currentLanguage)}</div>
                <div className="summary-row-value">
                  ¥{totalAmount.toLocaleString('en-US')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 数据表格 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <MonthlyExpenseTable data={data} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};
