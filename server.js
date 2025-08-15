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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
