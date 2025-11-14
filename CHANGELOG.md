# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [1.29.0] - 2025-11-14

### Added
- Service Worker 캐시 전략 최적화 (#292) (#297)

### Fixed
- service worker가 supabase auth api를 차단하는 문제 수정 (#303) (#304)
## [1.28.9] - 2025-08-06

### Changed
- 리드미 수정 (#287) (#288)
## [1.28.8] - 2025-08-06

### Changed
- 서비스 워커 주석 처리 (#285) (#286)
## [1.28.7] - 2025-08-06

### Changed
- 상품 상세 페이지 및 상품 리스트 리팩토링 #276 (#284)
## [1.28.6] - 2025-08-06

### Fixed
- 로그인 후 쿠키 셋팅 과정 누락되어 발생한 에러 임시 조치하여 middleware matcher list 복구 (#282) (#283)
## [1.28.5] - 2025-08-05

### Changed
- perf: 속도 개선을 위해 엄격한 인증 로직이 필요하지 않은 page, api route 요청인 경우 middleware 에서 제거 (#280) (#281)
## [1.28.4] - 2025-08-05

### Fixed
- pwa manager UI 가독성 개선 (#227) (#278)
## [1.28.3] - 2025-08-05

### Changed
- 아직 구현되지 않은 기능의 UI 요소에 준비중 토스트 처리 (#279)
## [1.28.2] - 2025-08-05

### Changed
- [perf] prefetch 하는 layout 위치 수정하여 성능 개선 및 상품 상세 페이지 레이아웃 UI 개선 (#266) (#274)
## [1.28.1] - 2025-08-05

### Added
- cookie를 사용하여 중복되는 인증 과정 제거 및 성능 개선 (#249) (#263)
- 경매 상태에 따른 타이머 중지 및 재설정 기능 및 기타 UI 변경  #259 (#264)
- 성능 측정 자동화 도구 도입 (#255) (#256)
- 경매 상태 관리 개선 및 즉시 시작 기능 구현 #251 (#253)

### Changed
- update CHANGELOG.md for v1.28.0
- update CHANGELOG.md for v1.28.0
- update CHANGELOG.md for v1.28.0
- update CHANGELOG.md for v1.28.0
- update CHANGELOG.md for v1.28.0
- update CHANGELOG.md for v1.28.0
- update CHANGELOG.md for v1.28.0
- bump version to v1.28.0
- 이미지 최적화 컴포넌트 리팩토링 및 Next.js Image 전환 (#261) (#262)
- refactor : ProductCard에 detail_address prop 추가 및 관련 컴포넌트 수정 #252 (#260)
- 리액트 아이콘 번들 최소화 #257 (#258)

### Fixed
- 릴리즈 버전 중복 생성 문제 해결  (#272)
- auth-utils 모듈 제거하여 barrel export 제거 (#269) (#270)
- 릴리즈 노트 작성 자동화 오류 수정 (#267) (#271)
- 릴리즈 노트 자동화 시스템 개선 및 CHANGELOG.md 업데이트 기능 수정 (#267) (#268)
- middleware config 설정을 정적 파일을 제외하는 형태에서 updateSession이 필요한 네트워크 요청의 경우를 직접 명시하는 방식으로 수정 (#250) (#254)
## [1.28.0] - 2025-08-05

### Added
- cookie를 사용하여 중복되는 인증 과정 제거 및 성능 개선 (#249) (#263)
- 경매 상태에 따른 타이머 중지 및 재설정 기능 및 기타 UI 변경  #259 (#264)
- 성능 측정 자동화 도구 도입 (#255) (#256)
- 경매 상태 관리 개선 및 즉시 시작 기능 구현 #251 (#253)

### Changed
- bump version to v1.28.0
- 이미지 최적화 컴포넌트 리팩토링 및 Next.js Image 전환 (#261) (#262)
- refactor : ProductCard에 detail_address prop 추가 및 관련 컴포넌트 수정 #252 (#260)
- 리액트 아이콘 번들 최소화 #257 (#258)

### Fixed
- auth-utils 모듈 제거하여 barrel export 제거 (#269) (#270)
- 릴리즈 노트 작성 자동화 오류 수정 (#267) (#271)
- 릴리즈 노트 자동화 시스템 개선 및 CHANGELOG.md 업데이트 기능 수정 (#267) (#268)
- middleware config 설정을 정적 파일을 제외하는 형태에서 updateSession이 필요한 네트워크 요청의 경우를 직접 명시하는 방식으로 수정 (#250) (#254)


## [1.1.0] - 2025-07-13

### Added
- 메타데이터 파일 및 SEO 관련 기능 추가 (#128) (#145)
- github 릴리즈 노트 자동화 시스템 구축 (#126)
- product list skeleton UI를 실제 레이아웃과 일치하도록 개선 (#119) (#122)
- 모바일 레이아웃 고정값에서 모바일 한정 반응형으로 수정 #88 (#102)
- 상품 상세 페이지 route 링크 추가 (#97) (#99)
- 상품 상세 페이지 서비스 함수 생성 및 데이터 fetch #91 (#95)
- 상품 경매 리스트 기능 구현 #69 (#85)
- 레이아웃 컴포넌트 및 네비게이션 시스템 구현 (#83)
- 상품 상세 조회 페이지 구현 #22 (#80)
- 상품 등록 기능 구현 (#79)
- 이미지 업로드 및 스토리지 관리 기능 구현 (#75)
- Badge 컴포넌트 업데이트 및 ProductBadge 컴포넌트 추가 #77 (#78)
- 버튼 컴포넌트에 rounded props 추가 및 variant와 colors props 분리, 디폴트 값 설정 #72 (#74)
- UI 패키지에 Thumbnail 컴포넌트 생성 #70 (#71)
- 버튼 컴포넌트 생성 (#68)
- vercel 배포 cicd 설정 (#62) (#63)
- prisma client 인스턴스 생성 (#61)
- 디자인 시스템 아이콘 컴포넌트 추가 #26 (#53)
- prisma 설치 및 세팅 (#51)
- 디자인 시스템 Textarea 컴포넌트 추가 (#46)
- 위치 등록 기능 구현 및 세션 인증 관련 오류 수정 (#36)
- 로그인/회원가입 에러, 리다이렉트 처리 #17 (#21)
- 디자인 시스템과 tailwindcss 유틸클래스 설정 #13 (#14)
- 로그인/회원가입 구현 #9 (#15)

### Changed
- bump version to v1.0.0
- chromatic.yml 파일에서 누락된 build 단계 추가 (#136)
- 스토리북 CI/CD 설정 #124 (#127)
- 상품 타입 구조 개선 (#121)
- [bug] 폰트 에러 다시 등장하여 next font 설정을 cdn에서 local 폰트로 수정 #98 (#117)
- 기존 버셀 빌드 에러 관련 hotfix 롤백 (#116)
- Fix/build error #101 (#105)
- Readme.md 업데이트 (#94)
- readme 전면 개선 및 프로젝트 문서화 강화 (#93)
- [hotfix] 지원하지 않는 next font 최적화 옵션 제거 #89 (#90)
- 아이콘 컴포넌트 스토리북 경로 수정 (#59) (#60)
- ui 패키지 내 절대경로 설정 #54 (#55)
- [bug] Web app에서 UI 패키지의 컴포넌트를 import 할 때 스타일이 적용되지 않는 이슈 해결 #50 (#52)
- 로그인/회원가입 로직 수정 #41 (#47)
- Input Message와 Label 컴포넌트 공통 수준으로 수정 (#45)
- [refact] UI 패키지의 Input 컴포넌트 수정 및 관련 컴포넌트, 훅, 스토리 추가 (#42)
- 색상 디자인 토큰 계층 구조의 이름을 Semantic, Scale, Primitive 에서 Utility, Semantic, Primitive 로 수정 #38 (#40)
- 기존 UI 패키지 컴포넌트를 css in css 형태로 재정의한 토큰 사용하도록 수정 (#31)
- turbo run storybook 실행 시 docs app의 스토리북이 실행되도록 설정 #29 (#30)
- 리드미 파일에서 팀 이름과 팀원 수정 (#3) (#19)
- web app 절대경로 설정과 import 순서 정의 #16 (#18)
- 프로젝트 페이지 디렉토리 설정 #11 (#12)

### Fixed
- release 스크립트 squash merge 환경 대응 개선 (#146)
- chromatic.yml 파일에서 turbo 명령어 사용 시 ui 패키지 호출명 오탈자 수정 (#139) (#142)
- chromatic.yml 파일에 supabase 환경변수 추가 및 turbo 명령어 사용 (#139) (#140)
- release 액션에서 기존 태그 중복 오류 수정 (#137) (#138)
- chromatic.yml 파일과 package.json의 pnpm 버전 일치하도록 수정 (#134) (#135)
- pnpm setup 순서 수정으로 executable 파일 찾을 수 없는 문제 해결 (#132) (#133)
- github actions에서 pnpm 설정 오류 수정 (#130) (#131)
- 버셀 빌드 오류 관련 재수정 #113 (#118)
- 상세페이지의 params 를 비동기 await 처리 (#111) (#112)
- 홈페이지의 상품리스트 suspense 적용 (#115)
- 빌드 에러 수정 #101 (#110)
- 빌드 에러 수정 #101 (#109)
- 빌드 에러 수정 #101 (#108)
- 빌드 에러 수정 #101 (#107)
- 빌드 에러 수정 #101 (#106)
- 빌드 에러 수정 #101 (#104)
- 프리즈마 관련 빌드 에러 수정 (#101) (#103)
- 상품 상세페이지에서 수직 스크롤이 적용되지 않는 이슈 수정 (#96) (#100)
- 페이지별 레이아웃이 다른 이슈로 products 페이지 제거 및 메인페이지 직접 적용 #86 (#87)
- 이미지 bucket 변경으로 인해 수정 (#81) (#82)
- bg-neutral 컬러를 bg-base로 수정 (#66) (#67)
- label 컴포넌트 htmlfor 타입 수정 및 textarea transition 클래스 제거 (#64) (#65)
- UI 패키지에서 런타임에서 절대경로를 읽지 못하는 이슈 해결 (#58)
- 기존 ui 패키지 내에 정의된 color 디자인 토큰 스토리 문서 수정 #33 (#37)
- 서버액션 비동기 처리 관련 에러 수정 #28 (#34)
- ui 패키지에서 정의한 유틸클래스와 토큰이 web app에서 적용되지 않는 문제 해결 #20 (#25)
- 로그인/회원가입 페이지 import 에러 수정 (#23) (#24)
- eslint 가 수정된 파일 위치를 찾지 못하는 이슈를 해결하기 위한 lefthook.yml 파일 수정 #6 (#8)
- Noto Sans KR 폰트가 웹에서 반영되지 않는 이슈 수정 #5 (#7)
## [1.1.0] - 2025-07-13

### Added
- 메타데이터 파일 및 SEO 관련 기능 추가 (#128) (#145)
- github 릴리즈 노트 자동화 시스템 구축 (#126)
- product list skeleton UI를 실제 레이아웃과 일치하도록 개선 (#119) (#122)
- 모바일 레이아웃 고정값에서 모바일 한정 반응형으로 수정 #88 (#102)
- 상품 상세 페이지 route 링크 추가 (#97) (#99)
- 상품 상세 페이지 서비스 함수 생성 및 데이터 fetch #91 (#95)
- 상품 경매 리스트 기능 구현 #69 (#85)
- 레이아웃 컴포넌트 및 네비게이션 시스템 구현 (#83)
- 상품 상세 조회 페이지 구현 #22 (#80)
- 상품 등록 기능 구현 (#79)
- 이미지 업로드 및 스토리지 관리 기능 구현 (#75)
- Badge 컴포넌트 업데이트 및 ProductBadge 컴포넌트 추가 #77 (#78)
- 버튼 컴포넌트에 rounded props 추가 및 variant와 colors props 분리, 디폴트 값 설정 #72 (#74)
- UI 패키지에 Thumbnail 컴포넌트 생성 #70 (#71)
- 버튼 컴포넌트 생성 (#68)
- vercel 배포 cicd 설정 (#62) (#63)
- prisma client 인스턴스 생성 (#61)
- 디자인 시스템 아이콘 컴포넌트 추가 #26 (#53)
- prisma 설치 및 세팅 (#51)
- 디자인 시스템 Textarea 컴포넌트 추가 (#46)
- 위치 등록 기능 구현 및 세션 인증 관련 오류 수정 (#36)
- 로그인/회원가입 에러, 리다이렉트 처리 #17 (#21)
- 디자인 시스템과 tailwindcss 유틸클래스 설정 #13 (#14)
- 로그인/회원가입 구현 #9 (#15)

### Changed
- bump version to v1.0.0
- chromatic.yml 파일에서 누락된 build 단계 추가 (#136)
- 스토리북 CI/CD 설정 #124 (#127)
- 상품 타입 구조 개선 (#121)
- [bug] 폰트 에러 다시 등장하여 next font 설정을 cdn에서 local 폰트로 수정 #98 (#117)
- 기존 버셀 빌드 에러 관련 hotfix 롤백 (#116)
- Fix/build error #101 (#105)
- Readme.md 업데이트 (#94)
- readme 전면 개선 및 프로젝트 문서화 강화 (#93)
- [hotfix] 지원하지 않는 next font 최적화 옵션 제거 #89 (#90)
- 아이콘 컴포넌트 스토리북 경로 수정 (#59) (#60)
- ui 패키지 내 절대경로 설정 #54 (#55)
- [bug] Web app에서 UI 패키지의 컴포넌트를 import 할 때 스타일이 적용되지 않는 이슈 해결 #50 (#52)
- 로그인/회원가입 로직 수정 #41 (#47)
- Input Message와 Label 컴포넌트 공통 수준으로 수정 (#45)
- [refact] UI 패키지의 Input 컴포넌트 수정 및 관련 컴포넌트, 훅, 스토리 추가 (#42)
- 색상 디자인 토큰 계층 구조의 이름을 Semantic, Scale, Primitive 에서 Utility, Semantic, Primitive 로 수정 #38 (#40)
- 기존 UI 패키지 컴포넌트를 css in css 형태로 재정의한 토큰 사용하도록 수정 (#31)
- turbo run storybook 실행 시 docs app의 스토리북이 실행되도록 설정 #29 (#30)
- 리드미 파일에서 팀 이름과 팀원 수정 (#3) (#19)
- web app 절대경로 설정과 import 순서 정의 #16 (#18)
- 프로젝트 페이지 디렉토리 설정 #11 (#12)

### Fixed
- release 스크립트 squash merge 환경 대응 개선 (#146)
- chromatic.yml 파일에서 turbo 명령어 사용 시 ui 패키지 호출명 오탈자 수정 (#139) (#142)
- chromatic.yml 파일에 supabase 환경변수 추가 및 turbo 명령어 사용 (#139) (#140)
- release 액션에서 기존 태그 중복 오류 수정 (#137) (#138)
- chromatic.yml 파일과 package.json의 pnpm 버전 일치하도록 수정 (#134) (#135)
- pnpm setup 순서 수정으로 executable 파일 찾을 수 없는 문제 해결 (#132) (#133)
- github actions에서 pnpm 설정 오류 수정 (#130) (#131)
- 버셀 빌드 오류 관련 재수정 #113 (#118)
- 상세페이지의 params 를 비동기 await 처리 (#111) (#112)
- 홈페이지의 상품리스트 suspense 적용 (#115)
- 빌드 에러 수정 #101 (#110)
- 빌드 에러 수정 #101 (#109)
- 빌드 에러 수정 #101 (#108)
- 빌드 에러 수정 #101 (#107)
- 빌드 에러 수정 #101 (#106)
- 빌드 에러 수정 #101 (#104)
- 프리즈마 관련 빌드 에러 수정 (#101) (#103)
- 상품 상세페이지에서 수직 스크롤이 적용되지 않는 이슈 수정 (#96) (#100)
- 페이지별 레이아웃이 다른 이슈로 products 페이지 제거 및 메인페이지 직접 적용 #86 (#87)
- 이미지 bucket 변경으로 인해 수정 (#81) (#82)
- bg-neutral 컬러를 bg-base로 수정 (#66) (#67)
- label 컴포넌트 htmlfor 타입 수정 및 textarea transition 클래스 제거 (#64) (#65)
- UI 패키지에서 런타임에서 절대경로를 읽지 못하는 이슈 해결 (#58)
- 기존 ui 패키지 내에 정의된 color 디자인 토큰 스토리 문서 수정 #33 (#37)
- 서버액션 비동기 처리 관련 에러 수정 #28 (#34)
- ui 패키지에서 정의한 유틸클래스와 토큰이 web app에서 적용되지 않는 문제 해결 #20 (#25)
- 로그인/회원가입 페이지 import 에러 수정 (#23) (#24)
- eslint 가 수정된 파일 위치를 찾지 못하는 이슈를 해결하기 위한 lefthook.yml 파일 수정 #6 (#8)
- Noto Sans KR 폰트가 웹에서 반영되지 않는 이슈 수정 #5 (#7)
## [1.0.0] - 2025-07-01

### Added
- 메타데이터 파일 및 SEO 관련 기능 추가

### Fixed  
- release 스크립트 squash merge 환경 대응 개선
- chromatic.yml 파일에서 turbo 명령어 사용 시 ui 패키지 호출명 오탈자 수정
- chromatic.yml 파일에 supabase 환경변수 추가 및 turbo 명령어 사용
- release 액션에서 기존 태그 중복 오류 수정
- chromatic.yml 파일과 package.json의 pnpm 버전 일치하도록 수정
- pnpm setup 순서 수정으로 executable 파일 찾을 수 없는 문제 해결
- github actions에서 pnpm 설정 오류 수정

### Changed
- chromatic.yml 파일에서 누락된 build 단계 추가
- 버전을 v1.0.0으로 업데이트