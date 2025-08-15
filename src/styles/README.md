# 通用样式指南

## 使用方法

在组件中导入通用样式：

```tsx
import '../styles/common.css';
```

## 颜色变量

使用CSS变量来保持颜色一致性：

```css
:root {
  --primary-blue: #99CCFF;    /* 主蓝色 - 表头背景 */
  --cash-yellow: #FFFF99;     /* 现金黄色 - cash行背景 */
  --digital-green: #CCFFCC;   /* 数字绿色 - digital行背景 */
  --text-dark: #242124;       /* 深色文字 */
  --border-gray: #d1d5db;     /* 边框灰色 */
  --tooltip-bg: #000000;      /* tooltip背景 */
  --tooltip-text: #ffffff;    /* tooltip文字 */
}
```

## 表格样式

### 基础表格结构
```tsx
<div className="expense-table">
  <div className="expense-table-header">
    <div className="expense-table-grid">
      <div className="expense-table-header-cell">标题1</div>
      <div className="expense-table-header-cell">标题2</div>
    </div>
  </div>
  <div className="expense-table-row expense-table-row-cash">
    <div className="expense-table-grid">
      <div className="expense-table-cell expense-table-cell-left">内容1</div>
      <div className="expense-table-cell expense-table-cell-right">内容2</div>
    </div>
  </div>
</div>
```

### 表格行背景色
- `.expense-table-row-cash` - 现金行（黄色背景）
- `.expense-table-row-digital` - 数字支付行（绿色背景）
- `.expense-table-row-default` - 默认行（白色背景）

### 单元格对齐
- `.expense-table-cell-left` - 左对齐（带缩进）
- `.expense-table-cell-center` - 居中对齐
- `.expense-table-cell-right` - 右对齐（带缩进）

## 按钮样式

```tsx
<button className="btn-primary">主要按钮</button>
<button className="btn-secondary">次要按钮</button>
```

## 卡片样式

```tsx
<div className="card">
  <div className="card-header">卡片标题</div>
  <div className="card-body">卡片内容</div>
  <div className="card-footer">卡片底部</div>
</div>
```

## 统计卡片

```tsx
<div className="stats-card">
  <div className="stats-card-body">
    <div className="flex items-center">
      <div className="stats-card-icon">
        {/* 图标 */}
      </div>
      <div className="stats-card-content">
        <dl>
          <dt className="stats-card-label">标签</dt>
          <dd className="stats-card-value">数值</dd>
        </dl>
      </div>
    </div>
  </div>
</div>
```

## 页面布局

```tsx
<div className="page-container">
  <div className="page-content">
    <div className="page-header">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">页面标题</h1>
          <p className="page-subtitle">页面副标题</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary">操作按钮</button>
        </div>
      </div>
    </div>
    
    <div className="grid-stats">
      {/* 统计卡片 */}
    </div>
    
    <div className="card">
      <div className="card-body">
        {/* 主要内容 */}
      </div>
    </div>
  </div>
</div>
```

## 状态样式

### 加载状态
```tsx
<div className="loading-container">
  <div className="loading-spinner"></div>
  <span className="loading-text">正在加载...</span>
</div>
```

### 错误状态
```tsx
<div className="error-container">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="error-icon">...</svg>
    </div>
    <div className="error-content">
      <h3 className="error-title">错误标题</h3>
      <div className="error-message">错误信息</div>
    </div>
  </div>
</div>
```

### 空状态
```tsx
<div className="empty-container">
  <svg className="empty-icon">...</svg>
  <h3 className="empty-title">暂无数据</h3>
  <p className="empty-description">没有找到相关记录</p>
</div>
```

## 工具类

- `.text-truncate` - 文本截断（Tailwind类）
- `.text-ellipsis` - 文本省略号
- `.fade-in` - 淡入动画
- `.slide-in` - 滑入动画

## 响应式网格

```tsx
<div className="grid-stats">
  {/* 统计卡片网格，移动端单列，桌面端三列 */}
</div>
```

## 最佳实践

1. **优先使用CSS类**：尽量使用预定义的CSS类，避免内联样式
2. **保持一致性**：使用相同的颜色变量和间距
3. **响应式设计**：使用Tailwind的响应式前缀
4. **可访问性**：确保颜色对比度符合WCAG标准
5. **性能优化**：避免过度嵌套的CSS选择器

## 扩展样式

如需添加新的样式，请：
1. 在 `common.css` 中添加新的CSS类
2. 更新此文档说明使用方法
3. 确保与现有样式保持一致
