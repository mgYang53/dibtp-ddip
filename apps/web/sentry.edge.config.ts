// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // 환경변수에서 DSN 가져오기 (배포 환경별로 다른 프로젝트 사용 가능)
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경별 트레이스 샘플링 비율
  // 개발: 100% (모든 트랜잭션), 프로덕션: 20% (비용 절감)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // PII(개인정보) 전송 비활성화 (보안 권장사항)
  // 필요시 환경변수로 제어: process.env.SENTRY_SEND_PII === 'true'
  sendDefaultPii: false,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
