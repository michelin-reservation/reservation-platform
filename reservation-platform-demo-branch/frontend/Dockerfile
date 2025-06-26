# 시연회용 간소화된 프론트엔드 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 5173

# 시연회용: 개발 서버로 실행
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ===== 시연회용 주석처리된 원본 설정들 =====
# FROM node:18-alpine as builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
#
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/dist /usr/share/nginx/html
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]