import { Worker } from 'bullmq';
import { PrismaService } from './prisma.service';
import { PayrollService } from './modules/payroll/payroll.service';

async function main() {
  const connection = { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } };

  const prisma = new PrismaService();
  await prisma.$connect();

  const payroll = new PayrollService(prisma);

  const w = new Worker(
    'payroll',
    async (job) => {
      const { runDate, actorId } = job.data as { runDate: string; actorId: string };
      return payroll.run(runDate, actorId);
    },
    connection
  );

  w.on('completed', (job) => console.log(`Job ${job.id} completed`));
  w.on('failed', (job, err) => console.error(`Job ${job?.id} failed`, err));

  console.log('Worker started.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
