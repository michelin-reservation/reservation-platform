import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  //배포전, 포트번호 바꿔서 보안성 업데이트 필요
  server: {
    port: 5173
  }
});
