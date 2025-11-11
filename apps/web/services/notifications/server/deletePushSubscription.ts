import { prisma } from '@web/lib/prisma';

export const deletePushSubscription = async (endpoint: string) => {
  await prisma.push_subscriptions.delete({
    where: { endpoint },
  });
};
