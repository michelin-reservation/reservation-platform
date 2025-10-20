# 시연회용 간소화된 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 클린업 후 의존성 설치
RUN rm -rf node_modules package-lock.json && npm install

# 소스 코드 복사
COPY . .

# 시연회용: Prisma 클라이언트 생성 (Docker 빌드 시점에)
RUN npx prisma generate

# 시연회용: Prisma 관련 설정 주석처리
# RUN npx prisma db push

# 포트 노출
EXPOSE 8001

# 시연회용: 간단한 시작 명령
CMD ["npm", "start"]

# ===== 시연회용 주석처리된 원본 설정들 =====
# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# ENV NODE_ENV=production
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1
# EXPOSE 8000
# CMD ["npm", "start"]