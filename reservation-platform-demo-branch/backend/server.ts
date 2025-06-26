import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    sequelize.close().then(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// PM2, Docker, Kubernetes 등에서 보내는 종료 시그널
process.on('SIGTERM', gracefulShutdown);

// 사용자가 직접 Ctrl+C로 종료할 때
process.on('SIGINT', gracefulShutdown);