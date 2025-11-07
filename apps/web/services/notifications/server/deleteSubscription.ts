import { prisma } from '@web/lib/prisma';

export const deleteSubscription = async (endpoint: string) => {
  await prisma.push_subscriptions.delete({
    where: { endpoint },
  });
};
