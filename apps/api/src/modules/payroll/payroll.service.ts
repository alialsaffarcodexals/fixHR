import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { createHash } from 'crypto';
import dayjs from 'dayjs';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  private async fortnightly(employee: any): Promise<number> {
    const ps = await this.prisma.payScale.findUnique({ where: { level: employee.payScale } });
    if (!ps) throw new BadRequestException('Invalid pay scale');
    const amount = Number(ps.annualAmountBHD) / 26;
    return Number(amount.toFixed(3));
  }

  async run(runDateISO: string, actorId: string) {
    const runDate = dayjs(runDateISO).startOf('day').toDate();
    const employees = await this.prisma.employee.findMany({ where: { deletedAt: null }, include: { department: true } });
    let companyTotal = 0;
    const lines: any[] = [];
    for (const e of employees) {
      const fortnightly = await this.fortnightly(e);
      companyTotal += fortnightly;
      lines.push({ e, fortnightly });
    }
    companyTotal = Number(companyTotal.toFixed(3));

    // Group by department for file content
    const byDept: Record<string, { header: string; lines: string[]; total: number }> = {};
    for (const { e, fortnightly } of lines) {
      const key = e.departmentId;
      const deptHeader = `Department: ${e.department.name} (Location: ${e.department.location})`;
      if (!byDept[key]) byDept[key] = { header: deptHeader, lines: [], total: 0 };
      byDept[key].lines.push(`${e.lastName}, ${e.firstName} | ${e.employeeId} | BHD ${fortnightly.toFixed(3)}`);
      byDept[key].total += fortnightly;
    }

    const dateDir = dayjs(runDate).format('YYYY-MM-DD');
    const baseDir = process.env.REPORTS_DIR || '/data/reports';
    const fs = await import('node:fs/promises');
    await fs.mkdir(`${baseDir}/${dateDir}`, { recursive: true });
    const company = process.env.COMPANY_NAME || 'Company';
    const parts: string[] = [];
    parts.push(`Company: ${company}`);
    parts.push(`Run Date: ${dayjs(runDate).format('YYYY-MM-DD')}`);
    parts.push('');
    for (const k of Object.keys(byDept)) {
      const d = byDept[k];
      parts.push(d.header);
      parts.push('-----------------------------------------------');
      parts.push(...d.lines);
      parts.push(`Department Total: BHD ${d.total.toFixed(3)}`);
      parts.push('');
    }
    parts.push(`Company Total: BHD ${companyTotal.toFixed(3)}`);
    const txt = parts.join('\n');
    const filePath = `${baseDir}/${dateDir}/payroll.txt`;
    await fs.writeFile(filePath, txt, 'utf8');

    // persist run
    const checksum = createHash('sha256').update(txt).digest('hex');
    const run = await this.prisma.payrollRun.create({
      data: {
        runDate,
        totalBHD: new Decimal(companyTotal.toString()),
        createdByUserId: actorId,
        filePath,
        checksum,
      },
    });
    for (const { e, fortnightly } of lines) {
      await this.prisma.payrollLine.create({
        data: {
          payrollRunId: run.id,
          employeeId: e.id,
          departmentId: e.departmentId,
          fortnightlyBHD: new Decimal(fortnightly.toString()),
        },
      });
    }
    return { runId: run.id, filePath, preview: txt };
  }

  async getReport(runId: string) {
    const run = await this.prisma.payrollRun.findUnique({ where: { id: runId } });
    if (!run) throw new BadRequestException('Run not found');
    const fs = await import('node:fs/promises');
    const content = await fs.readFile(run.filePath, 'utf8');
    return { filePath: run.filePath, content };
  }
}

