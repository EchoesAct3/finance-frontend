import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库配置
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  database: 'family_finances',
  user: 'root',
  password: '1q2w3e4r5t',
};

// 数据库连接池
const pool = mysql.createPool(dbConfig);

// API路由
app.get('/api/expenses', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM tmnt_expenses_view');
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('数据库查询错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 月度费用API路由
app.get('/api/monthly-expenses', async (req, res) => {
  try {
    const { monthKey } = req.query;
    
    if (!monthKey) {
      return res.status(400).json({
        success: false,
        error: '缺少月份参数'
      });
    }

    const connection = await pool.getConnection();
    // 修复查询逻辑：处理时区问题，使用UTC日期比较
    const sql = `SELECT * FROM monthly_all_expenses_view 
                 WHERE DATE(PAYMENT_DATE) >= ? AND DATE(PAYMENT_DATE) < DATE_ADD(?, INTERVAL 1 MONTH)
                 ORDER BY PAYMENT_DATE`;
    
    // 构建月份的开始日期
    const startDate = monthKey + '-01';
    
    console.log('=== 月度查询调试信息 ===');
    console.log('请求的月份:', monthKey);
    console.log('月份开始日期:', startDate);
    console.log('执行的SQL:', sql);
    console.log('SQL参数:', [startDate, startDate]);
    
    const [rows] = await connection.execute(sql, [startDate, startDate]);
    
    console.log('查询结果数量:', rows.length);
    console.log('前5条数据:');
    rows.slice(0, 5).forEach((row, index) => {
      console.log(`  数据${index + 1}:`, {
        PAYMENT_DATE: row.PAYMENT_DATE,
        MONTH_KEY: row.MONTH_KEY,
        PAYMENT_CLASSIFICATION: row.PAYMENT_CLASSIFICATION,
        AMOUNT: row.AMOUNT
      });
    });
    console.log('=== 调试信息结束 ===');
    
    connection.release();
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('月度数据库查询错误:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
