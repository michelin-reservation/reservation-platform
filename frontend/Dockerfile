# 시연회용 간소화된 프론트엔드 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 클린업 후 의존성 설치
RUN rm -rf node_modules package-lock.json && npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 5173

# 시연회용: ES 모듈 문제 해결을 위한 환경변수 설정
ENV NODE_OPTIONS="--experimental-specifier-resolution=node"

# 시연회용: 개발 서버로 실행
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# 원본 설정 (주석 처리)
# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# ENV NODE_ENV=production
# EXPOSE 3000
# CMD ["npm", "start"]