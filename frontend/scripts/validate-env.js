import { config } from "dotenv";
config();

const requiredEnvVars = [
  "VITE_API_URL",
  "VITE_SENTRY_DSN",
  "VITE_NAVER_MAP_CLIENT_ID",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ 다음 환경변수가 설정되지 않았습니다:");
  missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`));
  process.exit(1);
}

console.log("✅ 모든 필수 환경변수가 설정되었습니다.");
