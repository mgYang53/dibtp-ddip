import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DDIP(띱)',
    short_name: 'DDIP',
    id: '/',
    scope: '/',
    description:
      '띱! 먼저 가져가는 사람이 임자! 하향식 경매 시스템을 통해 중고 물품을 거래할 수 있는 플랫폼입니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ee8e1f',
    orientation: 'portrait',
    lang: 'ko',
    categories: ['shopping', 'lifestyle'],
    display_override: ['window-controls-overlay', 'standalone'],
    icons: [
      {
        src: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/images/screenshots/home-products.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow', // 모바일
        label: '홈 화면 - 경매 상품 목록',
      },
      {
        src: '/images/screenshots/product-detail.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
        label: '경매 상품 상세',
      },
      {
        src: '/images/screenshots/chat.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
        label: '실시간 채팅',
      },
    ],
    shortcuts: [
      {
        name: '상품 등록하기',
        short_name: '등록',
        description: '새로운 상품을 빠르게 등록합니다',
        url: '/products/register',
        icons: [
          {
            src: '/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: '내 채팅',
        short_name: '채팅',
        description: '채팅 목록을 확인합니다',
        url: '/chat/rooms',
        icons: [
          {
            src: '/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: '마이페이지',
        short_name: '마이',
        description: '프로필과 판매 내역을 확인합니다',
        url: '/mypage',
        icons: [
          {
            src: '/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}
