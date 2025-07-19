import { PrismaClient } from '@prisma/client';

// This helps prevent exhausting your database connection limit.
// In development, Next.js clears the Node.js cache on every change,
// which would create a new PrismaClient instance each time.

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
