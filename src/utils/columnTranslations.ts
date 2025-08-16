// 列名多语言翻译配置
export interface ColumnTranslation {
  [key: string]: {
    [language: string]: string;
  };
}

// 列名翻译映射
export const columnTranslations: ColumnTranslation = {
  PAYMENT_CLASSIFICATION: {
    'zh-CN': '支付分类',
    'ja-JP': '支払分類',
    'en-US': 'Payment Classification'
  },
  AMOUNT: {
    'zh-CN': '金额',
    'ja-JP': '金額',
    'en-US': 'Amount'
  },
  PAYMENT_DATE: {
    'zh-CN': '支付日期',
    'ja-JP': '支払日',
    'en-US': 'Payment Date'
  },
  COMMENT: {
    'zh-CN': '备注',
    'ja-JP': '備考',
    'en-US': 'Comment'
  }
};

// 页面文本翻译映射
export const pageTranslations: ColumnTranslation = {
  PAGE_TITLE: {
    'zh-CN': '家庭费用管理',
    'ja-JP': '家庭費用管理',
    'en-US': 'Family Expense Management'
  },
  PAGE_SUBTITLE: {
    'zh-CN': '查看和管理家庭费用支出记录',
    'ja-JP': '家庭費用支出記録の確認と管理',
    'en-US': 'View and manage family expense records'
  },
  LANGUAGE_LABEL: {
    'zh-CN': '语言:',
    'ja-JP': '言語:',
    'en-US': 'Language:'
  },
  LAST_UPDATED: {
    'zh-CN': '最后更新:',
    'ja-JP': '最終更新:',
    'en-US': 'Last Updated:'
  },
  REFRESH_BUTTON: {
    'zh-CN': '刷新数据',
    'ja-JP': 'データ更新',
    'en-US': 'Refresh Data'
  },
  REFRESHING: {
    'zh-CN': '刷新中...',
    'ja-JP': '更新中...',
    'en-US': 'Refreshing...'
  },
  SHOW_STATS: {
    'zh-CN': '连接状态',
    'ja-JP': '接続状態',
    'en-US': 'Connection'
  },
  HIDE_STATS: {
    'zh-CN': '隐藏状态',
    'ja-JP': '状態非表示',
    'en-US': 'Hide Status'
  },
  TOTAL_AMOUNT: {
    'zh-CN': '合计金额',
    'ja-JP': '合計金額',
    'en-US': 'Total Amount'
  }
};

// 支持的语言列表
export const supportedLanguages = {
  'zh-CN': '简体中文',
  'ja-JP': '日本語',
  'en-US': 'English'
};

// 获取当前语言（可以从localStorage、URL参数或用户设置获取）
export function getCurrentLanguage(): string {
  // 优先从localStorage获取用户设置
  const savedLanguage = localStorage.getItem('preferred-language');
  if (savedLanguage && supportedLanguages[savedLanguage as keyof typeof supportedLanguages]) {
    return savedLanguage;
  }
  
  // 从浏览器语言检测
  const browserLanguage = navigator.language;
  if (browserLanguage.startsWith('zh')) return 'zh-CN';
  if (browserLanguage.startsWith('ja')) return 'ja-JP';
  
  // 默认返回日语（根据你的需求）
  return 'ja-JP';
}

// 翻译列名
export function translateColumnName(columnName: string, language?: string): string {
  const currentLanguage = language || getCurrentLanguage();
  const translation = columnTranslations[columnName];
  
  if (!translation) {
    return columnName; // 如果没有翻译，返回原列名
  }
  
  return translation[currentLanguage] || translation['ja-JP'] || columnName;
}

// 翻译页面文本
export function translatePageText(textKey: string, language?: string): string {
  const currentLanguage = language || getCurrentLanguage();
  const translation = pageTranslations[textKey];
  
  if (!translation) {
    return textKey; // 如果没有翻译，返回原文本
  }
  
  return translation[currentLanguage] || translation['ja-JP'] || textKey;
}

// 批量翻译列名
export function translateColumnNames(columnNames: string[], language?: string): string[] {
  return columnNames.map(column => translateColumnName(column, language));
}

// 设置用户语言偏好
export function setLanguagePreference(language: string): void {
  if (supportedLanguages[language as keyof typeof supportedLanguages]) {
    localStorage.setItem('preferred-language', language);
  }
}

// 获取所有支持的语言
export function getSupportedLanguages(): typeof supportedLanguages {
  return supportedLanguages;
}
