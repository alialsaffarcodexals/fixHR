import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function isDbEmpty() {
  const count = await prisma.department.count();
  return count === 0;
}

async function run() {
  const file = process.env.STARTUP_FILE || 'seed/startup.txt';
  if (!(await isDbEmpty())) {
    console.log('DB not empty; skipping startup import.');
    return;
  }
  const lines = fs.readFileSync(file,'utf8').split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);
  let idx = 0;
  const N = parseInt(lines[idx++],10);
  for (let i=0; i<N; i++) {
    const name = lines[idx++];
    const location = lines[idx++];
    const M = parseInt(lines[idx++],10);
    const dept = await prisma.department.create({ data: { departmentId: `D-${Date.now()}-${i}`, name, location } });
    for (let j=0; j<M; j++) {
      const firstName = lines[idx++];
      const lastName = lines[idx++];
      const gender = lines[idx++];
      const address = lines[idx++];
      const payScale = parseInt(lines[idx++],10);
      await prisma.employee.create({
        data: {
          employeeId: `E-${Date.now()}-${i}-${j}`,
          firstName, lastName, gender, address, payScale, departmentId: dept.id,
        },
      });
    }
  }
  console.log('Startup import complete.');
  await prisma.$disconnect();
}

run();

