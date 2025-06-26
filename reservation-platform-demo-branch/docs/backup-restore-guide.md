# DB/스토리지 백업 및 복구 매뉴얼

## 1. DB 백업

### MySQL 백업
```bash
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup.sql
```

### PostgreSQL 백업 (예시)
```bash
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup.sql
```

## 2. DB 복구

### MySQL 복구
```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backup.sql
```

### PostgreSQL 복구 (예시)
```bash
psql -h $DB_HOST -U $DB_USER $DB_NAME < backup.sql
```

## 3. 장애 발생 시 대응

- helm rollback backend [REVISION]  # 이전 버전으로 롤백
- kubectl logs, describe로 원인 파악
- 필요시 DB/Redis 복구
- 서비스 중단 최소화 위해 롤링 배포/자동화 권장

## 4. 스토리지(PVC) 백업/복구

- 클라우드 스토리지 스냅샷, Velero 등 활용
- 중요 데이터는 주기적 백업 정책 수립

## 5. 운영 팁

- 백업 파일은 안전한 외부 저장소(S3, NCP Object Storage 등)에 보관
- 복구 테스트를 정기적으로 수행하여 신뢰성 확보
- 장애/복구/백업 절차는 문서화하여 팀원과 공유