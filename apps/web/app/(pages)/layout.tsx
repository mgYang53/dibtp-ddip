import type { Metadata } from 'next';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { BannerManager } from '@web/components/shared';
import { createServerQueryClient, prefetchMyInfo } from '@web/lib/query/server';
import QueryProvider from '@web/providers/QueryProvider';

export const metadata: Metadata = {
  title: '홈 - 경매 플랫폼',
  description: '지역 기반 중고 물품 경매 플랫폼 홈페이지',
};

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = createServerQueryClient();
  await prefetchMyInfo(queryClient);

  return (
    <QueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
        <BannerManager />
      </HydrationBoundary>
    </QueryProvider>
  );
};

export default MainLayout;
