const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const clockRoutes = require('./routes/clock');
const workHoursRoutes = require('./routes/workHours');
const applicationRoutes = require('./routes/application');
const monthlySummaryRoutes = require('./routes/monthlySummary');
const notificationRoutes = require('./routes/notifications');
const masterRoutes = require('./routes/master');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティング設定
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/clock', clockRoutes);
app.use('/api/work-hours', workHoursRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/monthly-summary', monthlySummaryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/master', masterRoutes);

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// エラーハンドリング
app.use(errorHandler);

// 404ハンドリング
app.use(notFoundHandler);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});


