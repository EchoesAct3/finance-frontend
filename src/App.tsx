import React, { useState } from 'react';
import { ExpensePage } from './pages/ExpensePage';
import { MonthlyExpensePage } from './pages/MonthlyExpensePage';
import './App.css';
import './styles/common.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'expense' | 'monthly'>('expense');

  return (
    <div className="App">
      {/* 页面切换导航 */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage('expense')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentPage === 'expense'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              费用管理
            </button>
            <button
              onClick={() => setCurrentPage('monthly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentPage === 'monthly'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              月度费用
            </button>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      {currentPage === 'expense' ? <ExpensePage /> : <MonthlyExpensePage />}
    </div>
  );
}

export default App;
