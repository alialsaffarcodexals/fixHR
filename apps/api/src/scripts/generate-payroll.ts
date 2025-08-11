import { PayrollService } from '../modules/payroll/payroll.service';
import { PrismaService } from '../prisma.service';

async function run() {
  const prisma = new PrismaService();
  await prisma.$connect();
  const svc = new PayrollService(prisma);
  const date = new Date().toISOString();
  const result = await svc.run(date, 'cli');
  console.log(result.preview);
  await prisma.$disconnect();
}
run();

